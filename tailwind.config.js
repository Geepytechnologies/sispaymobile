/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#14A673",
        appblue: "#031D42",
      },
    },
    fontFamily: {
      SpaceMono: ["SpaceMono"],
      Poppins: [
        "Poppins_300Light",
        "Poppins_400Regular",
        "Poppins_500Medium",
        "Poppins_600SemiBold",
        "Poppins_700Bold",
      ],
      Inter: [
        "Inter_400Regular",
        "Inter_500Medium",
        "Inter_600SemiBold",
        "Inter_700Bold",
      ],
      Montserrat: [
        "Montserrat_400Regular",
        "Montserrat_500Medium",
        "Montserrat_600SemiBold",
        "Montserrat_700Bold",
      ],
    },
  },
  plugins: [],
};
