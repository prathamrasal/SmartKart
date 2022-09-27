/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        flipkartYellow : '#FEDA00',
        flipkartBlue : '#2874F0',
        bgPrimary : {
          700 : 'white',
          600 : '#EEF0F3',
          500 : 'white'
        },
        textPrimary : 'black'
      }
    },
  },
  plugins: [],
}