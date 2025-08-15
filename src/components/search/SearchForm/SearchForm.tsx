import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Users, Calendar, MapPin, Plane } from "lucide-react";
import { CalendarModal } from "@/components/modals/CalendarModal/CalendarModal";
import { PassengerModal } from "@/components/modals/PassengerModal/PassengerModal";
import { FlightSearchParams, Airport } from "@/types";
import { AirportSelect } from "../AirportSelect/AirportSelect";

interface SearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  loading?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading,
}) => {
  const [tripType, setTripType] = useState<"round-trip" | "one-way">(
    "round-trip"
  );
  const [origin, setOrigin] = useState<Airport | undefined>();
  const [destination, setDestination] = useState<Airport | undefined>();
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [cabinClass, setCabinClass] = useState<
    "economy" | "premium_economy" | "business" | "first"
  >("economy");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [calendarType, setCalendarType] = useState<"departure" | "return">(
    "departure"
  );
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwapAirports = async () => {
    setIsSwapping(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setIsSwapping(false);
  };

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) {
      return;
    }

    if (tripType === "round-trip" && !returnDate) {
      return;
    }

    const searchParams: FlightSearchParams = {
      origin: origin.iata,
      destination: destination.iata,
      departureDate,
      returnDate: tripType === "round-trip" ? returnDate : undefined,
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      cabinClass,
      tripType,
    };

    onSearch(searchParams);
  };

  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants;
  };

  const cabinClassLabels = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First Class",
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="max-w-6xl mx-auto"
    >
      {/* Trip Type Selector */}
      <motion.div
        className="flex items-center gap-1 p-1 mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-fit mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {(["round-trip", "one-way"] as const).map((type) => (
          <motion.button
            key={type}
            onClick={() => setTripType(type)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
              tripType === type
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tripType === type && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"
                layoutId="tripTypeSelector"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">
              {type === "round-trip" ? "Round trip" : "One way"}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Main Search Form */}
      <motion.div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Airports Row */}
        <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            className="lg:col-span-2 md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              From
            </label>
            <motion.div
              className="relative group"
              animate={isSwapping ? { x: [0, 20, 0] } : {}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <AirportSelect
                value={origin}
                onChange={setOrigin}
                placeholder="Where from?"
                className="relative z-10 w-full p-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/80"
              />
              <MapPin
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-20"
                size={20}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-end justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button
              onClick={handleSwapAirports}
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              animate={isSwapping ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <ArrowUpDown size={20} className="group-hover:animate-pulse" />
            </motion.button>
          </motion.div>

          <motion.div
            className="lg:col-span-2 md:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              To
            </label>
            <motion.div
              className="relative group"
              animate={isSwapping ? { x: [0, -20, 0] } : {}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <AirportSelect
                value={destination}
                onChange={setDestination}
                placeholder="Where to?"
                className="relative z-10 w-full p-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-white/80"
              />
              <Plane
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-20"
                size={20}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Dates and Passengers Row */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Departure
            </label>
            <motion.button
              onClick={() => {
                setCalendarType("departure");
                setShowCalendarModal(true);
              }}
              className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl text-left transition-all duration-300 hover:bg-white/80 hover:shadow-lg group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span
                  className={
                    departureDate
                      ? "text-gray-800 font-medium"
                      : "text-gray-400"
                  }
                >
                  {departureDate ? formatDate(departureDate) : "Select date"}
                </span>
                <Calendar
                  className="text-blue-500 group-hover:scale-110 transition-transform duration-200"
                  size={20}
                />
              </div>
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {tripType === "round-trip" && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Return
                </label>
                <motion.button
                  onClick={() => {
                    setCalendarType("return");
                    setShowCalendarModal(true);
                  }}
                  className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl text-left transition-all duration-300 hover:bg-white/80 hover:shadow-lg group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        returnDate
                          ? "text-gray-800 font-medium"
                          : "text-gray-400"
                      }
                    >
                      {returnDate ? formatDate(returnDate) : "Select date"}
                    </span>
                    <Calendar
                      className="text-purple-500 group-hover:scale-110 transition-transform duration-200"
                      size={20}
                    />
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Passengers
            </label>
            <motion.button
              onClick={() => setShowPassengerModal(true)}
              className="w-full p-4 bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl text-left transition-all duration-300 hover:bg-white/80 hover:shadow-lg group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-800 font-medium">
                    {getTotalPassengers()} passenger
                    {getTotalPassengers() > 1 ? "s" : ""}
                  </div>
                  <div className="text-sm text-gray-500">
                    {cabinClassLabels[cabinClass]}
                  </div>
                </div>
                <Users
                  className="text-indigo-500 group-hover:scale-110 transition-transform duration-200"
                  size={20}
                />
              </div>
            </motion.button>
          </motion.div>
        </div>

        {/* Search Button */}
        <motion.button
          onClick={handleSearch}
          disabled={loading || !origin || !destination || !departureDate}
          className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          <span className="relative z-10">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Searching flights...
              </div>
            ) : (
              "Search flights"
            )}
          </span>
        </motion.button>
      </motion.div>

      {/* Modals */}
      <CalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={calendarType === "departure" ? departureDate : returnDate}
        onDateSelect={(date) => {
          if (calendarType === "departure") {
            setDepartureDate(date);
          } else {
            setReturnDate(date);
          }
          setShowCalendarModal(false);
        }}
        title={
          calendarType === "departure"
            ? "Select departure date"
            : "Select return date"
        }
        minDate={
          calendarType === "return" && departureDate ? departureDate : undefined
        }
      />

      <PassengerModal
        isOpen={showPassengerModal}
        onClose={() => setShowPassengerModal(false)}
        passengers={passengers}
        onPassengersChange={setPassengers}
        cabinClass={cabinClass}
        onCabinClassChange={setCabinClass}
      />
    </motion.div>
  );
};
