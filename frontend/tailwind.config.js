/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5624d0", // Udemy-like purple
        secondary: "#1c1d1f", // Dark text
        accent: "#0056d2", // Blue
        light: "#f7f9fa", // Light background
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
