// tailwind.config.js
/** @type {import('nativewind/tailwind').Config} */
module.exports = {
  presets: [require('nativewind/preset')],        // <- required for RN
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryButton: '#0047B6',
        focusedNavigation: '#000000',
        unfocusedNavigation: '#C1C1C1',
        subheader: '#676769',
      },
      fontFamily: {
        lthin: ['Lexend-Thin', 'sans-serif'],
        lextralight: ['Lexend-ExtraLight', 'sans-serif'],
        llight: ['Lexend-Light', 'sans-serif'],
        lregular: ['Lexend-Regular', 'sans-serif'],
        lmedium: ['Lexend-Medium', 'sans-serif'],
        lsemibold: ['Lexend-SemiBold', 'sans-serif'],
        lbold: ['Lexend-Bold', 'sans-serif'],
        lextrabold: ['Lexend-ExtraBold', 'sans-serif'],
        lblack: ['Lexend-Black', 'sans-serif'],
      },
      fontSize: {
        'custom-header': '38px',
        'custom-subheader': '18px',
      },
      margin: {
        header: '5rem',
      },
    },
  },
  plugins: [],
  // Optional: if you construct class names dynamically, safelist them here
  // safelist: ['bg-primaryButton', 'text-subheader'],
};
