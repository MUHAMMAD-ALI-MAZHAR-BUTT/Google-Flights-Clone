import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlightCard } from '../FlightCard/FlightCard';
import { Modal } from '@/components/common/Modal/Modal';
import { Button } from '@/components/common/Button/Button';
import { Loading } from '@/components/common/Loading/Loading';
import { FlightOffer } from '@/types';

interface FlightListProps {
  flights: FlightOffer[];
  loading?: boolean;
  onSelectFlight: (flight: FlightOffer) => void;
}

export const FlightList: React.FC<FlightListProps> = ({
  flights,
  loading,
  onSelectFlight
}) => {
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleViewDetails = (flight: FlightOffer) => {
    setSelectedFlight(flight);
    setShowDetailsModal(true);
  };

  const handleSelectFlight = (flight: FlightOffer) => {
    setSelectedFlight(flight);
    setShowConfirmModal(true);
  };

  const handleConfirmSelection = () => {
    if (selectedFlight) {
      onSelectFlight(selectedFlight);
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (flights.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: 'var(--text-secondary)'
      }}>
        <h3>No flights found</h3>
        <p>This could be due to:</p>
        <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '16px auto', lineHeight: '1.6' }}>
          <li>API rate limits or temporary issues</li>
          <li>No flights available for selected route/date</li>
          <li>Try different airports or dates</li>
        </ul>
        <p style={{ fontSize: '14px', marginTop: '20px' }}>
          The app will show mock data as fallback when API is unavailable
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
            {flights.length} flights found
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Prices are per person and include taxes and fees
          </p>
        </div>

        <AnimatePresence>
          {flights.map((flight, index) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FlightCard
                offer={flight}
                onSelect={handleSelectFlight}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Flight Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Flight Details"
        size="large"
      >
        {selectedFlight && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3>Outbound Flight</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                <div>
                  <strong>Departure:</strong> {selectedFlight.outbound.origin.name} ({selectedFlight.outbound.origin.iata})
                  <br />
                  <strong>Time:</strong> {new Date(selectedFlight.outbound.departureTime).toLocaleString()}
                </div>
                <div>
                  <strong>Arrival:</strong> {selectedFlight.outbound.destination.name} ({selectedFlight.outbound.destination.iata})
                  <br />
                  <strong>Time:</strong> {new Date(selectedFlight.outbound.arrivalTime).toLocaleString()}
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <strong>Duration:</strong> {selectedFlight.outbound.duration} | 
                <strong> Stops:</strong> {selectedFlight.outbound.stops === 0 ? 'Nonstop' : `${selectedFlight.outbound.stops} stop(s)`} |
                <strong> Aircraft:</strong> {selectedFlight.outbound.aircraft}
              </div>
            </div>

            {selectedFlight.inbound && (
              <div>
                <h3>Return Flight</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <div>
                    <strong>Departure:</strong> {selectedFlight.inbound.origin.name} ({selectedFlight.inbound.origin.iata})
                    <br />
                    <strong>Time:</strong> {new Date(selectedFlight.inbound.departureTime).toLocaleString()}
                  </div>
                  <div>
                    <strong>Arrival:</strong> {selectedFlight.inbound.destination.name} ({selectedFlight.inbound.destination.iata})
                    <br />
                    <strong>Time:</strong> {new Date(selectedFlight.inbound.arrivalTime).toLocaleString()}
                  </div>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <strong>Duration:</strong> {selectedFlight.inbound.duration} | 
                  <strong> Stops:</strong> {selectedFlight.inbound.stops === 0 ? 'Nonstop' : `${selectedFlight.inbound.stops} stop(s)`} |
                  <strong> Aircraft:</strong> {selectedFlight.inbound.aircraft}
                </div>
              </div>
            )}

            <div style={{ 
              padding: '16px', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>Total Price:</strong></span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                  ${selectedFlight.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Flight Selection"
        size="medium"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSelection}>
              Confirm Selection
            </Button>
          </>
        }
      >
        {selectedFlight && (
          <div>
            <p>Are you sure you want to select this flight?</p>
            <div style={{ 
              marginTop: '16px', 
              padding: '16px', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)' 
            }}>
              <strong>{selectedFlight.validatingAirline}</strong>
              <br />
              {selectedFlight.outbound.origin.city} → {selectedFlight.outbound.destination.city}
              {selectedFlight.inbound && (
                <>
                  <br />
                  {selectedFlight.inbound.origin.city} → {selectedFlight.inbound.destination.city}
                </>
              )}
              <br />
              <strong>Total: ${selectedFlight.totalPrice.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};