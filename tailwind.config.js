/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // NativeWind v4 uses its own content resolution
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        blue: "#3F83C5",
        pale: "#D5DFF0",
        graphite: "#454A54",
        paper: "#F7F7F3",
        "admin-canvas": "#F2F2EF",
        line: "#D8D8D5",
        muted: "#777777",
        "success-bg": "#E9F2EA",
        "success-text": "#37673E",
        error: "#B42318",
        warning: "#9A6700",
      },
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      spacing: {
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-5": "20px",
        "space-6": "24px",
        "space-8": "32px",
        "space-10": "40px",
        "space-12": "48px",
        "space-16": "64px",
        "space-20": "80px",
        "space-24": "96px",
        "space-30": "120px",
      },
      screens: {
        tablet: "768px",
        desktop: "1024px",
        wide: "1440px",
      },
      maxWidth: {
        content: "1600px",
      },
      borderRadius: {
        none: "0",
        xs: "2px",
        sm: "4px",
      },
      zIndex: {
        base: "0",
        sticky: "10",
        header: "20",
        drawer: "40",
        backdrop: "50",
        modal: "60",
        toast: "70",
      },
    },
  },
  plugins: [],
};

