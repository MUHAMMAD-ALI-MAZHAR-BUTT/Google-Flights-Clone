import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Sun, Moon, Menu, X, Wifi, WifiOff } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { searchAirports } from "@/services/api";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );

  useEffect(() => {
    const testApi = async () => {
      try {
        await searchAirports("test");
        setApiStatus("online");
      } catch (error) {
        setApiStatus("offline");
      }
    };
    testApi();
  }, []);

  const navItems = [
    { label: "Flights", href: "/", active: true },
    { label: "Hotels", href: "/hotels" },
    { label: "Car Rentals", href: "/cars" },
    { label: "Packages", href: "/packages" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Plane size={18} />
          </div>
          <h1 className={styles.logoText}>Google Flights</h1>
        </a>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`${styles.navLink} ${
                item.active ? styles.active : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color:
                apiStatus === "online"
                  ? "var(--success-green)"
                  : "var(--text-tertiary)",
              marginRight: "12px",
            }}
            title={`API Status: ${apiStatus}`}
          >
            {apiStatus === "online" ? (
              <Wifi size={14} />
            ) : (
              <WifiOff size={14} />
            )}
            <span>
              {apiStatus === "checking"
                ? "Checking..."
                : apiStatus === "online"
                ? "Live Data"
                : "Mock Data"}
            </span>
          </div>

          <motion.button
            className={styles.themeToggle}
            onClick={toggleTheme}
            whileTap={{ scale: 0.95 }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <button
            className={styles.mobileMenu}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            className={styles.mobileNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`${styles.navLink} ${
                  item.active ? styles.active : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
