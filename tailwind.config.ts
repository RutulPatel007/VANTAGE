import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--bg-base) / <alpha-value>)",
        surface: "rgb(var(--bg-surface) / <alpha-value>)",
        elevated: "rgb(var(--bg-elevated) / <alpha-value>)",
        overlay: "rgb(var(--bg-overlay) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        signal: "rgb(var(--signal) / <alpha-value>)",
        pending: "rgb(var(--pending) / <alpha-value>)",
        approved: "rgb(var(--approved) / <alpha-value>)",
        rejected: "rgb(var(--rejected) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        "text-1": "rgb(var(--text-1) / <alpha-value>)",
        "text-2": "rgb(var(--text-2) / <alpha-value>)",
        "text-3": "rgb(var(--text-3) / <alpha-value>)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99,102,241,0.22), 0 16px 42px rgba(99,102,241,0.16)",
      },
      keyframes: {
        pulseRing: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245,158,11,0.2)" },
          "50%": { boxShadow: "0 0 0 8px rgba(245,158,11,0)" },
        },
        dashflow: {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-120" },
        },
      },
      animation: {
        "pulse-ring": "pulseRing 1.8s ease-in-out infinite",
        dashflow: "dashflow 6s linear infinite",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
