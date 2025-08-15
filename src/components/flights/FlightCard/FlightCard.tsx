import React from "react";
import { motion } from "framer-motion";
import { Plane, Clock, Users } from "lucide-react";
import { Button } from "@/components/common/Button/Button";
import { FlightOffer } from "@/types";
import styles from "./FlightCard.module.css";

interface FlightCardProps {
  offer: FlightOffer;
  onSelect: (offer: FlightOffer) => void;
  onViewDetails: (offer: FlightOffer) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  offer,
  onSelect,
  onViewDetails,
}) => {
  const formatTime = (dateString: string) => {
    const [year, month, day, hour, minute] = dateString
      .split(/[-T:]/)
      .map(Number);
    const date = new Date(year, month - 1, day, hour, minute);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStopsText = (stops: number) => {
    if (stops === 0) return "Nonstop";
    if (stops === 1) return "1 stop";
    return `${stops} stops`;
  };

  const getAirlineCode = (airline: string) => {
    return airline.substring(0, 2).toUpperCase();
  };

  const renderFlightSegment = (
    flight: typeof offer.outbound,
    label?: string
  ) => (
    <div>
      {label && <div className={styles.returnLabel}>{label}</div>}
      <div className={styles.flightInfo}>
        <div className={styles.departure}>
          <div className={styles.time}>{formatTime(flight.departureTime)}</div>
          <div className={styles.airport}>{flight.origin.iata}</div>
          <div className={styles.city}>{flight.origin.city}</div>
        </div>

        <div className={styles.route}>
          <div className={styles.duration}>{flight.duration}</div>
          <div className={styles.routeLine} />
          <div className={styles.stops}>{getStopsText(flight.stops)}</div>
        </div>

        <div className={styles.arrival}>
          <div className={styles.time}>{formatTime(flight.arrivalTime)}</div>
          <div className={styles.airport}>{flight.destination.iata}</div>
          <div className={styles.city}>{flight.destination.city}</div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onViewDetails(offer)}
    >
      <div className={styles.header}>
        <div className={styles.airline}>
          <div className={styles.airlineLogo}>
            {getAirlineCode(offer.validatingAirline)}
          </div>
          <span className={styles.airlineName}>{offer.validatingAirline}</span>
        </div>

        <div className={styles.price}>
          <h3 className={styles.priceAmount}>
            ${offer.totalPrice.toLocaleString()}
          </h3>
          <div className={styles.priceLabel}>per person</div>
        </div>
      </div>

      {renderFlightSegment(offer.outbound)}

      {offer.inbound && (
        <div className={styles.returnFlight}>
          {renderFlightSegment(offer.inbound, "Return")}
        </div>
      )}

      <div className={styles.details}>
        <div className={styles.flightDetails}>
          <div className={styles.detailItem}>
            <Plane size={16} />
            <span>{offer.outbound.aircraft}</span>
          </div>
          <div className={styles.detailItem}>
            <Clock size={16} />
            <span>{offer.outbound.duration}</span>
          </div>
          <div className={styles.detailItem}>
            <Users size={16} />
            <span>{offer.outbound.cabinClass}</span>
          </div>
        </div>

        <Button
          className={styles.selectButton}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(offer);
          }}
          size="small"
        >
          Select
        </Button>
      </div>
    </motion.div>
  );
};
