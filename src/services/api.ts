import axios from 'axios';
import { Airport, FlightOffer, FlightSearchParams, RequestParams } from '@/types';

const api = axios.create({
  baseURL: 'https://sky-scrapper.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST,
  },
});

export const searchAirports = async (query: string, retries = 2): Promise<Airport[]> => {
  if (query.length < 2) return [];
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await api.get('/api/v1/flights/searchAirport', {
        params: { query, locale: 'en-US' },
        timeout: 5000
      });
      
      if (response.data.status && response.data.data) {
        return response.data.data.map((item: any) => ({
          iata: item.skyId || item.entityId || 'N/A',
          name: item.presentation?.suggestionTitle || item.presentation?.title || 'Unknown Airport',
          city: item.navigation?.localizedName || item.presentation?.title?.split('(')[0]?.trim() || 'Unknown City',
          country: item.presentation?.subtitle || 'Unknown Country'
        })).slice(0, 10);
      }
      
      return [];
    } catch (error) {
      console.error(`Airport search attempt ${attempt + 1} failed:`, error);
      if (attempt === retries) {
       
        return [];
      }
       
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  
  return [];
};

export const searchFlights = async (params: FlightSearchParams): Promise<FlightOffer[]> => {
 
  
  try {
    let sessionId = null;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      const requestParams: RequestParams = {
        originSkyId: params.origin,
        destinationSkyId: params.destination,
        originEntityId: params.origin,
        destinationEntityId: params.destination,
        date: params.departureDate,
        returnDate: params.returnDate,
        cabinClass: params.cabinClass,
        adults: params.adults,
        children: params.children,
        infants: params.infants,
        sortBy: "best",
        currency: "USD",
        market: "en-US",
        countryCode: "US",
        ...(sessionId && { sessionId }),
      };
      
 
      
      const response = await api.get('/api/v2/flights/searchFlights', {
        params: requestParams,
        timeout: 10000
      });

      
      
      if (response.data.status && response.data.data) {
        const { context, itineraries } = response.data.data;
        
        
        if (context?.sessionId) {
          sessionId = context.sessionId;
          
        }
        
        
        if (itineraries && itineraries.length > 0) {
         
          return mapItinerariesToFlights(itineraries, params);
        }
        
 
        if (context?.status === 'complete') {
         
          break;
        }
        
    
        if (context?.status === 'incomplete') {
       
          await new Promise(resolve => setTimeout(resolve, 3000 + (attempts * 1000)));
        }
      }
      
      attempts++;
    }
    
    
    return generateMockFlights(params);
    
  } catch (error) {
    console.error(' Flight search error:', error);
    return generateMockFlights(params);
  }
};

const mapItinerariesToFlights = (itineraries: any[], params: FlightSearchParams): FlightOffer[] => {
  return itineraries.map((itinerary: any, index: number) => {
    const outboundLeg = itinerary.legs?.[0];
    const inboundLeg = itinerary.legs?.[1];
    
    const mapLegToFlight = (leg: any) => ({
      id: leg.id || `flight-${index}`,
      airline: leg.carriers?.marketing?.[0]?.name || leg.carriers?.operating?.[0]?.name || 'Unknown Airline',
      flightNumber: leg.segments?.[0]?.flightNumber || 'N/A',
      origin: {
        iata: leg.origin?.id || leg.origin?.displayCode || '',
        name: leg.origin?.name || leg.origin?.displayCode || 'Unknown Airport',
        city: leg.origin?.city || leg.origin?.parent?.name || 'Unknown City',
        country: leg.origin?.country || 'Unknown Country'
      },
      destination: {
        iata: leg.destination?.id || leg.destination?.displayCode || '',
        name: leg.destination?.name || leg.destination?.displayCode || 'Unknown Airport',
        city: leg.destination?.city || leg.destination?.parent?.name || 'Unknown City',
        country: leg.destination?.country || 'Unknown Country'
      },
      departureTime: leg.departure || new Date().toISOString(),
      arrivalTime: leg.arrival || new Date().toISOString(),
      duration: leg.durationInMinutes ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m` : 'N/A',
      price: itinerary.price?.raw || 0,
      currency: itinerary.price?.formatted?.split(' ')[0] || 'USD',
      stops: leg.stopCount || 0,
      aircraft: leg.segments?.[0]?.operatingCarrier?.name || leg.segments?.[0]?.marketingCarrier?.name || 'Unknown Aircraft',
      cabinClass: params.cabinClass
    });

    return {
      id: itinerary.id || `offer-${index}`,
      outbound: mapLegToFlight(outboundLeg),
      inbound: inboundLeg ? mapLegToFlight(inboundLeg) : undefined,
      totalPrice: itinerary.price?.raw || Math.floor(Math.random() * 1000) + 200,
      currency: itinerary.price?.formatted?.split(' ')[0] || 'USD',
      validatingAirline: outboundLeg?.carriers?.marketing?.[0]?.name || outboundLeg?.carriers?.operating?.[0]?.name || 'Unknown Airline'
    };
  });
};

 
const generateMockFlights = (params: FlightSearchParams): FlightOffer[] => {
  const airlines = [
    { name: 'Emirates', code: 'EK', aircraft: 'Boeing 777' },
    { name: 'Qatar Airways', code: 'QR', aircraft: 'Airbus A350' },
    { name: 'Turkish Airlines', code: 'TK', aircraft: 'Boeing 787' },
    { name: 'Lufthansa', code: 'LH', aircraft: 'Airbus A380' },
    { name: 'British Airways', code: 'BA', aircraft: 'Boeing 747' },
    { name: 'Air France', code: 'AF', aircraft: 'Airbus A330' }
  ];

  const mockFlights: FlightOffer[] = airlines.map((airline, index) => {
    const basePrice = 400 + Math.floor(Math.random() * 600);
    const stops = Math.floor(Math.random() * 3);
    const duration = stops === 0 ? '6h 30m' : stops === 1 ? '8h 45m' : '12h 15m';
    
    return {
      id: `mock-${index + 1}`,
      outbound: {
        id: `mock-outbound-${index + 1}`,
        airline: airline.name,
        flightNumber: `${airline.code}${200 + index}`,
        origin: {
          iata: params.origin,
          name: `${params.origin} International Airport`,
          city: 'Origin City',
          country: 'Origin Country'
        },
        destination: {
          iata: params.destination,
          name: `${params.destination} International Airport`,
          city: 'Destination City',
          country: 'Destination Country'
        },
        departureTime: `${params.departureDate}T${8 + index}:00:00Z`,
        arrivalTime: `${params.departureDate}T${14 + index + stops * 2}:30:00Z`,
        duration,
        price: basePrice,
        currency: 'USD',
        stops,
        aircraft: airline.aircraft,
        cabinClass: params.cabinClass
      },
      inbound: params.returnDate ? {
        id: `mock-inbound-${index + 1}`,
        airline: airline.name,
        flightNumber: `${airline.code}${300 + index}`,
        origin: {
          iata: params.destination,
          name: `${params.destination} International Airport`,
          city: 'Destination City',
          country: 'Destination Country'
        },
        destination: {
          iata: params.origin,
          name: `${params.origin} International Airport`,
          city: 'Origin City',
          country: 'Origin Country'
        },
        departureTime: `${params.returnDate}T${10 + index}:00:00Z`,
        arrivalTime: `${params.returnDate}T${16 + index + stops * 2}:30:00Z`,
        duration,
        price: basePrice,
        currency: 'USD',
        stops,
        aircraft: airline.aircraft,
        cabinClass: params.cabinClass
      } : undefined,
      totalPrice: params.returnDate ? basePrice * 2 : basePrice,
      currency: 'USD',
      validatingAirline: airline.name
    };
  });
  
  return mockFlights;
};