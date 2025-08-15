import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from './Success.module.css';

interface SuccessProps {
  title?: string;
  message?: string;
  showConfetti?: boolean;
}

export const Success: React.FC<SuccessProps> = ({
  title = "Success!",
  message = "Your flight has been selected successfully.",
  showConfetti = true
}) => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {showConfetti && (
        <>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={styles.confetti} />
          ))}
        </>
      )}
      
      <motion.div
        className={styles.checkmark}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
      >
        <Check size={40} />
      </motion.div>
      
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {title}
      </motion.h2>
      
      <motion.p
        className={styles.message}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};