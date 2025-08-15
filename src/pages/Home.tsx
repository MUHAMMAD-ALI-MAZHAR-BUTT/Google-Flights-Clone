import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FlightList } from "@/components/flights/FlightList/FlightList";
import { Success } from "@/components/common/Success/Success";
import { searchFlights } from "@/services/api";
import { FlightSearchParams, FlightOffer } from "@/types";
import { SearchForm } from "@/components/search/SearchForm/SearchForm";

export const Home: React.FC = () => {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFlightDetails, setSelectedFlightDetails] =
    useState<FlightOffer | null>(null);

  const handleSearch = async (params: FlightSearchParams) => {
    setLoading(true);
    setHasSearched(true);
    setFlights([]);

    try {
      const results = await searchFlights(params);
   
      setFlights(results);

      if (results.length === 0) {
        console.log("No flights found");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight: FlightOffer) => {
    setSelectedFlightDetails(flight);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setSelectedFlightDetails(null);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", backgroundColor: "var(--bg-secondary)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        <SearchForm onSearch={handleSearch} loading={loading} />

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                backgroundColor: "var(--bg-primary)",
                borderRadius: "var(--radius-xl)",
                padding: "32px",
                marginTop: "24px",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <Success
                title="Flight Selected!"
                message={
                  selectedFlightDetails
                    ? `${
                        selectedFlightDetails.validatingAirline
                      } flight for $${selectedFlightDetails.totalPrice.toLocaleString()} has been selected. Redirecting to booking...`
                    : "Your flight has been selected successfully."
                }
              />
            </motion.div>
          ) : hasSearched ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              style={{
                backgroundColor: "var(--bg-primary)",
                borderRadius: "var(--radius-xl)",
                padding: "32px",
                marginTop: "24px",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <FlightList
                flights={flights}
                loading={loading}
                onSelectFlight={handleSelectFlight}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
