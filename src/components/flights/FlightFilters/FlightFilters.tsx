import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { SearchFilters } from '@/types';
import styles from './FlightFilters.module.css';

interface FlightFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export const FlightFilters: React.FC<FlightFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    onFiltersChange({
      ...filters,
      maxPrice: field === 'max' ? numValue : filters.maxPrice
    });
  };

  const handleStopsChange = (stops: number, checked: boolean) => {
    const currentStops = filters.stops || [];
    const newStops = checked 
      ? [...currentStops, stops]
      : currentStops.filter(s => s !== stops);
    
    onFiltersChange({
      ...filters,
      stops: newStops.length > 0 ? newStops : undefined
    });
  };

  const handleAirlineChange = (airline: string, checked: boolean) => {
    const currentAirlines = filters.airlines || [];
    const newAirlines = checked
      ? [...currentAirlines, airline]
      : currentAirlines.filter(a => a !== airline);
    
    onFiltersChange({
      ...filters,
      airlines: newAirlines.length > 0 ? newAirlines : undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Filter size={18} style={{ marginRight: '8px', display: 'inline' }} />
          Filters
        </h3>
        {hasActiveFilters && (
          <button className={styles.clearButton} onClick={clearFilters}>
            <X size={16} style={{ marginRight: '4px' }} />
            Clear all
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Price Range</label>
          <div className={styles.priceRange}>
            <input
              type="number"
              placeholder="Min"
              className={styles.priceInput}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className={styles.priceInput}
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Stops</label>
          <div className={styles.checkboxGroup}>
            {[
              { value: 0, label: 'Nonstop' },
              { value: 1, label: '1 stop' },
              { value: 2, label: '2+ stops' }
            ].map(({ value, label }) => (
              <div
                key={value}
                className={styles.checkboxItem}
                onClick={() => handleStopsChange(value, !(filters.stops || []).includes(value))}
              >
                <div className={`${styles.checkbox} ${
                  (filters.stops || []).includes(value) ? styles.checked : ''
                }`} />
                <span className={styles.checkboxLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Airlines</label>
          <div className={styles.checkboxGroup}>
            {[
              'Emirates',
              'Qatar Airways',
              'Turkish Airlines',
              'Lufthansa',
              'British Airways'
            ].map((airline) => (
              <div
                key={airline}
                className={styles.checkboxItem}
                onClick={() => handleAirlineChange(airline, !(filters.airlines || []).includes(airline))}
              >
                <div className={`${styles.checkbox} ${
                  (filters.airlines || []).includes(airline) ? styles.checked : ''
                }`} />
                <span className={styles.checkboxLabel}>{airline}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Departure Time</label>
          <div className={styles.checkboxGroup}>
            {[
              { value: 'morning', label: 'Morning (6AM - 12PM)' },
              { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
              { value: 'evening', label: 'Evening (6PM - 12AM)' },
              { value: 'night', label: 'Night (12AM - 6AM)' }
            ].map(({ value, label }) => (
              <div
                key={value}
                className={styles.checkboxItem}
                onClick={() => {
                  const current = filters.departureTime || [];
                  const isSelected = current.includes(value);
                  const newTimes = isSelected
                    ? current.filter(t => t !== value)
                    : [...current, value];
                  
                  onFiltersChange({
                    ...filters,
                    departureTime: newTimes.length > 0 ? newTimes : undefined
                  });
                }}
              >
                <div className={`${styles.checkbox} ${
                  (filters.departureTime || []).includes(value) ? styles.checked : ''
                }`} />
                <span className={styles.checkboxLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};