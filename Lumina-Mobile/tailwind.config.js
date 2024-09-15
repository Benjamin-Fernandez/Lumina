/** @type {import('nativewind/tailwind').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryButton: "#0047B6",
        focusedNavigation: "#000000",
        unfocusedNavigation: "#C1C1C1",
        subheader: "#676769",
      },
      fontFamily: {
        lthin: ["Lexend-Thin", "sans-serif"],
        lextralight: ["Lexend-ExtraLight", "sans-serif"],
        llight: ["Lexend-Light", "sans-serif"],
        lregular: ["Lexend-Regular", "sans-serif"],
        lmedium: ["Lexend-Medium", "sans-serif"],
        lsemibold: ["Lexend-SemiBold", "sans-serif"],
        lbold: ["Lexend-Bold", "sans-serif"],
        lextrabold: ["Lexend-ExtraBold", "sans-serif"],
        lblack: ["Lexend-Black", "sans-serif"],
      },
      fontSize: {
        "custom-header": "38px",
        "custom-subheader": "18px",
      },
    },
  },
  plugins: [],
};
