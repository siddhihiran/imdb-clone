"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sun, Moon, Eye, Monitor } from "lucide-react";
import { useTheme, Theme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const options: { id: Theme; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "dark", label: "Dark", icon: Moon },
    { id: "light", label: "Light", icon: Sun },
    { id: "high-contrast", label: "High Contrast", icon: Eye },
    { id: "auto", label: "Auto", icon: Monitor },
  ];

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 450, damping: 32 };

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 shadow-inner gap-1"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = theme === opt.id;

        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setTheme(opt.id)}
            className={`relative px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors z-10 ${
              isSelected
                ? "text-black font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="theme-active-indicator"
                transition={transition}
                className="absolute inset-0 bg-yellow-500 rounded-lg -z-10 shadow-sm"
              />
            )}
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
