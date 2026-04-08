/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E', // Deep Teal
          light: '#14B8A6',
          dark: '#0D9488',
        },
        secondary: {
          DEFAULT: '#F59E0B', // Amber (Gold)
          light: '#FBBF24',
          dark: '#D97706',
        },
        mogadishu: {
          sky: '#E0F2FE',
          sand: '#FEF3C7',
          sea: '#0EA5E9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
    },
  },
  plugins: [],
}
