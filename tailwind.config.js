/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#14A673",
        appblue: "#031D42",
      },
    },
    fontFamily: {
      mont: ["Montserrat", "sans-serif"],
      rob: ["Roboto", "sans-serif"],
      popp: ["Poppins", "sans-serif"],
      space: ["SpaceMono", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
  },
  plugins: [],
};
