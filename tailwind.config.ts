import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#050811",
          card: "#0b1120",
          cardHover: "#111a2e",
          border: "#1e293b",
          borderGlow: "#334155",
          emerald: "#10b981",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          amber: "#f59e0b",
          rose: "#f43f5e",
          slate: "#64748b",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Consolas",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "monospace",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        "cyber-sm": "0 0 10px -2px rgba(16, 185, 129, 0.15)",
        "cyber-md": "0 0 20px -3px rgba(16, 185, 129, 0.25)",
        "cyber-cyan": "0 0 20px -3px rgba(6, 182, 212, 0.25)",
        "cyber-rose": "0 0 20px -3px rgba(244, 63, 94, 0.25)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-border": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { borderColor: "rgba(16, 185, 129, 0.3)" },
          "100%": { borderColor: "rgba(16, 185, 129, 0.8)" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
