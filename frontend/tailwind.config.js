/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#8b5cf6', // A premium purple
        dark: '#0a0f1c',  // Deep background
        card: '#111827',
      }
    },
  },
  plugins: [],
}