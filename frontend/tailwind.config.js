/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:{
          bg: '#ffffff',
          color: '#0d0d0e',
        },
        secondary:{
          bg: '#f9f9f9',
          color: '#6f7480',
        },
        muted:{
          bg: '#f8f8fa',
          color: '#a0a6b2',
        }
      }
    },
  },
  plugins: [],
}