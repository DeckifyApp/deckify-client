/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        deck: {
          black: '#0E1117',
          page: '#111620',
          card: '#191F2A',
          soft: '#222A37',
          muted: '#A7AFBE',
          purple: '#6C63FF',
          navy: '#211F58',
          green: '#21C686',
          orange: '#F5B44B',
          red: '#FF5C5C',
          blue: '#51A7FF',
        },
      },
    },
  },
  plugins: [],
};
