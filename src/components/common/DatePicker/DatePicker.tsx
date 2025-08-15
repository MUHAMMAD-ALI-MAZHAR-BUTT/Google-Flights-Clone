import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const today = new Date();
  const minDateTime = minDate ? new Date(minDate) : today;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    if (date < minDateTime) return;
    
    const dateString = date.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef<HTMLDivElement>(null);

  const updateCalendarPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setCalendarPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    }
  };

  const handleInputClick = () => {
    updateCalendarPosition();
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {label && <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>{label}</label>}
      
      <div
        ref={inputRef}
        className={styles.input}
        onClick={handleInputClick}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={20} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ color: selectedDate ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.calendar}
            style={{
              top: calendarPosition.top,
              left: calendarPosition.left
            }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.calendarHeader}>
              <button
                className={styles.navButton}
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className={styles.monthYear}>{monthYear}</div>
              
              <button
                className={styles.navButton}
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className={styles.daysGrid}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={styles.dayHeader}>
                  {day}
                </div>
              ))}
              
              {days.map((date, index) => {
                const isSelected = selectedDate && 
                  date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === today.toDateString();
                const isOtherMonth = date.getMonth() !== currentMonth.getMonth();
                const isDisabled = date < minDateTime;

                return (
                  <motion.button
                    key={index}
                    className={`${styles.day} ${
                      isSelected ? styles.selected : ''
                    } ${isToday ? styles.today : ''} ${
                      isOtherMonth ? styles.otherMonth : ''
                    } ${isDisabled ? styles.disabled : ''}`}
                    onClick={() => handleDateClick(date)}
                    disabled={isDisabled}
                    whileHover={{ scale: isDisabled ? 1 : 1.1 }}
                    whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                  >
                    {date.getDate()}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};