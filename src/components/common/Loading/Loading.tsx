import React from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import styles from './Loading.module.css';

interface LoadingProps {
  text?: string;
  subtext?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  text = "Searching for flights...",
  subtext = "Trying multiple API endpoints for best results..."
}) => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.plane}
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Plane size={80} style={{ color: 'var(--primary-blue)' }} />
      </motion.div>
      
      <div className={styles.spinner} />
      
      <div className={styles.text}>{text}</div>
      <div className={styles.subtext}>{subtext}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
        Sky Scrapper API • Multiple endpoints
      </div>
      
      <div className={styles.dots}>
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
      </div>
    </motion.div>
  );
};