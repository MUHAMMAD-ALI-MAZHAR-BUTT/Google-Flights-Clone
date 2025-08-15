import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";

interface PassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  onPassengersChange: (passengers: {
    adults: number;
    children: number;
    infants: number;
  }) => void;
  cabinClass: "economy" | "premium_economy" | "business" | "first";
  onCabinClassChange: (
    cabinClass: "economy" | "premium_economy" | "business" | "first"
  ) => void;
}

export const PassengerModal: React.FC<PassengerModalProps> = ({
  isOpen,
  onClose,
  passengers,
  onPassengersChange,
  cabinClass,
  onCabinClassChange,
}) => {
  const cabinClassOptions = [
    {
      value: "economy" as const,
      label: "Economy",
      description: "Standard seating with basic amenities",
    },
    {
      value: "premium_economy" as const,
      label: "Premium Economy",
      description: "Extra legroom and enhanced service",
    },
    {
      value: "business" as const,
      label: "Business",
      description: "Priority boarding and premium dining",
    },
    {
      value: "first" as const,
      label: "First Class",
      description: "Luxury experience with full-flat beds",
    },
  ];

  const passengerTypes = [
    {
      key: "adults" as const,
      label: "Adults",
      description: "12+ years",
      min: 1,
      icon: "👥",
    },
    {
      key: "children" as const,
      label: "Children",
      description: "2-11 years",
      min: 0,
      icon: "👶",
    },
    {
      key: "infants" as const,
      label: "Infants",
      description: "Under 2 years",
      min: 0,
      icon: "🍼",
    },
  ];

  const updatePassengers = (type: keyof typeof passengers, value: number) => {
    onPassengersChange({
      ...passengers,
      [type]: value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-lg max-h-screen overflow-y-auto scrollbar-hide bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          >
            {/* Header */}
            <div className="px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Passengers & Class
                </h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full outline-none  hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20}  className="hover:text-red"/>
                </motion.button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Passengers Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Passengers
                </h3>
                <div className="space-y-4">
                  {passengerTypes.map((type, index) => (
                    <motion.div
                      key={type.key}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <div className="font-medium text-gray-800">
                            {type.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {type.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={() =>
                            updatePassengers(
                              type.key,
                              Math.max(type.min, passengers[type.key] - 1)
                            )
                          }
                          disabled={passengers[type.key] <= type.min}
                          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Minus size={16} />
                        </motion.button>

                        <motion.span
                          key={passengers[type.key]}
                          className="w-8 text-center font-medium"
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {passengers[type.key]}
                        </motion.span>

                        <motion.button
                          onClick={() =>
                            updatePassengers(type.key, passengers[type.key] + 1)
                          }
                          className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Cabin Class Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Cabin Class
                </h3>
                <div className="space-y-3">
                  {cabinClassOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      onClick={() => onCabinClassChange(option.value)}
                      className={`w-full p-4 rounded-2xl outline-none  border-2 transition-all duration-200 text-left ${
                        cabinClass === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/70"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`w-5 h-5 rounded-full border-2 transition-colors ${
                            cabinClass === option.value
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                          animate={
                            cabinClass === option.value
                              ? { scale: [1, 1.2, 1] }
                              : {}
                          }
                          transition={{ duration: 0.3 }}
                        >
                          {cabinClass === option.value && (
                            <motion.div
                              className="w-full h-full rounded-full bg-blue-500"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </motion.div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
