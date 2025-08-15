import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { Airport } from "@/types";
import { AIR_PORTS } from "@/constants/locations";

interface AirportSelectProps {
  value?: Airport;
  onChange: (airport: Airport | undefined) => void;
  placeholder?: string;
  className?: string;
}

export const AirportSelect: React.FC<AirportSelectProps> = ({
  value,
  onChange,
  placeholder = "Search airports...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredAirports = AIR_PORTS.filter(
    (airport) =>
      airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.iata.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredAirports.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredAirports.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredAirports.length) {
        selectAirport(filteredAirports[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectAirport = (airport: Airport) => {
    onChange(airport);
    setSearchTerm("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const displayValue = value ? `${value.city} (${value.iata})` : searchTerm;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`pr-10 ${className}`}
        />
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={18}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 outline-none w-full mt-2 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-h-64 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-h-64 overflow-y-auto">
              {filteredAirports.length > 0 ? (
                filteredAirports.map((airport, index) => (
                  <motion.div
                    key={airport.iata}
                    onClick={() => selectAirport(airport)}
                    className={`p-4 cursor-pointer transition-all duration-200 border-b border-gray-100/50 last:border-b-0 ${
                      index === highlightedIndex
                        ? "bg-gradient-to-r from-blue-50 to-purple-50"
                        : "hover:bg-gray-50/50"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <MapPin className="text-white" size={18} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {airport.iata}
                          </span>
                          <span className="text-sm text-gray-500">
                            {airport.city}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {airport.name}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="p-4 text-center text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  No airports found
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
