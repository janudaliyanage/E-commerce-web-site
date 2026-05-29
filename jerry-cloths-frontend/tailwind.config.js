/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          display: ['Oswald', 'sans-serif'],
        },
        colors: {
          'brand-black': '#121212',
          'brand-gold': '#D4AF37', 
          'brand-green': '#2F4F4F',
        },
        animation: {
          'fade-in': 'fadeIn 0.2s ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(-10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          }
        }
      },
    },
    plugins: [],
  }