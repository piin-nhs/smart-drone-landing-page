"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-card-border bg-card text-foreground hover:border-neon-cyan focus:outline-none transition-all duration-300 cursor-pointer shadow-md hover:shadow-neon-glow"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        // Icon Mặt trăng (Chế độ Light chuyển sang Dark)
        <svg
          className="w-5 h-5 text-foreground transition-transform duration-300 hover:rotate-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // Icon Mặt trời (Chế độ Dark chuyển sang Light)
        <svg
          className="w-5 h-5 text-neon-cyan animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      )}
    </button>
  );
}
