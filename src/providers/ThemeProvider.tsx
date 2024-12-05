"use client";

import { createContext, useContext, useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "light" | "dark";

const ThemeProviderContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "light",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { darkMode, toggleDarkMode } = useSettingsStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Ajouter la classe de transition avant le changement
    root.classList.add("theme-transition");

    // Retirer la classe de transition après l'animation
    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);

    return () => clearTimeout(timeout);
  }, [darkMode]);

  const value = {
    theme: darkMode ? "dark" : "light",
    setTheme: (theme: Theme) => {
      if (theme === "dark" && !darkMode) {
        toggleDarkMode();
      } else if (theme === "light" && darkMode) {
        toggleDarkMode();
      }
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
