/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5F3EE',
          dark: '#ECE8DF',
          light: '#FAF9F6',
        },
        charcoal: {
          DEFAULT: '#111111',
          muted: '#2A2A2A',
          subtle: '#4A4A4A',
          border: '#D8D4CC',
        },
        accent: {
          DEFAULT: '#C9B79C',
          hover: '#BAA78A',
          light: '#DDD1BD',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
        'super-wide': '0.35em',
      },
    },
  },
  plugins: [],
}

