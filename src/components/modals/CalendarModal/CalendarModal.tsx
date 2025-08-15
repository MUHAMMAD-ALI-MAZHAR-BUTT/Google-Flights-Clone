import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  title: string;
  minDate?: string;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
  title,
  minDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today) return true;

    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }

    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = getDaysInMonth(currentDate);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
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
            className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Calendar Navigation */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <motion.button
                  onClick={() => navigateMonth("prev")}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={20} />
                </motion.button>

                <motion.h3
                  className="text-lg font-semibold text-gray-800"
                  key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </motion.h3>

                <motion.button
                  onClick={() => navigateMonth("next")}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <motion.div
                className="grid grid-cols-7 gap-1"
                key={`${currentDate.getMonth()}-${currentDate.getFullYear()}-grid`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {days.map((date, index) => (
                  <div key={index} className="aspect-square">
                    {date && (
                      <motion.button
                        onClick={() =>
                          !isDateDisabled(date) &&
                          onDateSelect(formatDateForInput(date))
                        }
                        disabled={isDateDisabled(date)}
                        className={`w-full h-full rounded-xl font-medium transition-all duration-200 relative overflow-hidden ${
                          isDateSelected(date)
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : isDateDisabled(date)
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                        whileHover={!isDateDisabled(date) ? { scale: 1.1 } : {}}
                        whileTap={!isDateDisabled(date) ? { scale: 0.95 } : {}}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01, duration: 0.2 }}
                      >
                        {isDateSelected(date) && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"
                            layoutId="selectedDate"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <span className="relative z-10">{date.getDate()}</span>
                      </motion.button>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
