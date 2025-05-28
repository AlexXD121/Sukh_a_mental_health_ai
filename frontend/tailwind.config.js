/** @type {import('tailwindcss').Config} */
export default {
   darkMode: 'class', // or 'media'
  content: [
     "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
        backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

