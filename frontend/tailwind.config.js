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
          DEFAULT: '#2563EB', // Professional Blue
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald Green
        },
        accent: {
          DEFAULT: '#F97316', // Orange
        },
        danger: {
          DEFAULT: '#EF4444', // Red
        },
        gray: {
          dark: '#1F2937', // Dark Text
          light: '#F9FAFB', // Light Background
          border: '#E5E7EB', // Border Gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
