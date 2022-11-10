/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        myOrange: "#f18805",
        myGray: "#d7dedc",
        myBlue: " #002366",
      },
    },
  },
  plugins: [],
};
