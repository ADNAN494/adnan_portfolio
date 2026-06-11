/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#0c1110",
        secondary: "#a3aeab",
        tertiary: "#141b19",
        "black-100": "#101715",
        "black-200": "#0a0e0d",
        "white-100": "#f3f3f3",
        peach: {
          DEFAULT: "#e8a76f",
          dark: "#d97b3f",
        },
        mint: "#6ee7b7",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0px 20px 50px -20px rgba(0, 0, 0, 0.6)",
        glow: "0 0 35px rgba(232, 167, 111, 0.18)",
        "glow-mint": "0 0 35px rgba(110, 231, 183, 0.15)",
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
