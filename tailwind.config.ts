import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        card: {
          DEFAULT: "#171717",
          hover: "#1f1f1f",
        },
        accent: {
          gold: "#d4af37",
          indigo: "#6366f1",
        },
        text: {
          primary: "#ffffff",
          secondary: "#a3a3a3",
        },
        primary: {
          DEFAULT: "#e50914",
          hover: "#b2070f",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "scale-up": "scaleUp 0.2s ease-in-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
