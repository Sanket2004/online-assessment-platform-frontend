/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rethink Sans", ...defaultTheme.fontFamily.sans],
        mono: ["Space Mono", ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        lg: "12px", // Larger border radius for cards and containers
        md: "8px",  // Medium border radius for buttons and inputs
        sm: "4px",  // Small border radius for finer elements
      },
      colors: {
        background: "#f2f2f2", // Light gray background
        foreground: "#2e2e2e", // Darker text for better contrast
        card: {
          DEFAULT: "#ffffff", // White card background
          foreground: "#3c3c3c", // Darker text within cards
        },
        popover: {
          DEFAULT: "#ffffff", // Popovers with white background
          foreground: "#2e2e2e", // Text color in popovers
        },
        primary: {
          DEFAULT: "#5cb41f", // green
          foreground: "#ffffff", // Text on primary color (white)
        },
        secondary: {
          DEFAULT: "#025b40", // Dark green for secondary elements
          foreground: "#ffffff", // Text on secondary (white)
        },
        muted: {
          DEFAULT: "#f6f6f6", // Lighter muted background
          foreground: "#666666", // Muted foreground text
        },
        accent: {
          DEFAULT: "#025b40", // Bright blue for accents
          foreground: "#ffffff", // Text on accents
        },
        destructive: {
          DEFAULT: "#e74c3c", // Red for destructive actions
          foreground: "#ffffff", // Text on destructive elements
        },
        border: "#d1d5db", // Light border color for input fields, cards, etc.
        input: "#cbcbcb", // Input field background
        ring: "#ff7700",  // Focus ring color (Ubuntu orange)
        chart: {
          "1": "#ffb74d",  // Chart colors for dynamic charts or visualizations
          "2": "#ff8a65",
          "3": "#4db6ac",
          "4": "#9575cd",
          "5": "#4fc3f7",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
