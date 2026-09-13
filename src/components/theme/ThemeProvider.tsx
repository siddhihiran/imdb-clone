"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Theme = "dark" | "light" | "high-contrast" | "auto";
export type ResolvedTheme = "dark" | "light" | "high-contrast";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Theme;
}

export function ThemeProvider({ children, initialTheme = "dark" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (initialTheme === "auto") {
      return resolveSystemTheme();
    }
    return initialTheme as ResolvedTheme;
  });

  const applyTheme = useCallback((targetTheme: Theme) => {
    let resolved: ResolvedTheme = "dark";
    if (targetTheme === "auto") {
      resolved = resolveSystemTheme();
    } else {
      resolved = targetTheme;
    }

    setResolvedTheme(resolved);

    // Apply to DOM
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.setAttribute("data-theme", resolved);
      if (resolved === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
      } else {
        root.classList.remove("light");
        root.classList.add("dark");
      }
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setCookie("theme", newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  // Handle system color scheme change if auto
  useEffect(() => {
    applyTheme(theme);

    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("auto");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
