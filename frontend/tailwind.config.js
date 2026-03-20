/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        floral: {
          50: '#fdf8f6',
          100: '#f9ebe6',
          200: '#f2d5c8',
          300: '#e8b59e',
          400: '#dc8f6a',
          500: '#d1704b',
          600: '#c25a3d',
          700: '#a14633',
          800: '#843b2f',
          900: '#6d3329',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe2',
          200: '#c8d7c6',
          300: '#a0b89d',
          400: '#739472',
          500: '#527651',
          600: '#405f3f',
          700: '#354d34',
          800: '#2d3f2c',
          900: '#253425',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Source Sans 3"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
