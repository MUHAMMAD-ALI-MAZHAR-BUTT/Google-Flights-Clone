export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  tripType: 'round-trip' | 'one-way' | 'multi-city';
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  aircraft: string;
  cabinClass: string;
}

export interface FlightOffer {
  id: string;
  outbound: Flight;
  inbound?: Flight;
  totalPrice: number;
  currency: string;
  validatingAirline: string;
}

export interface SearchFilters {
  maxPrice?: number;
  stops?: number[];
  airlines?: string[];
  departureTime?: string[];
  duration?: number;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}




export interface RequestParams {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string;
  cabinClass: string;
  adults: number;
  children: number;
  infants: number;
  sortBy: string;
  currency: string;
  market: string;
  countryCode: string;
  sessionId?: string;
}