/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          dark: '#0f1419',
          medium: '#1a202c',
          light: '#2d3748',
          accent: '#4fd1c7',
          warning: '#f6ad55',
          danger: '#fc8181',
          success: '#68d391'
        }
      }
    },
  },
  plugins: [],
}