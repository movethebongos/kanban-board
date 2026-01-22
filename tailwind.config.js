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
          dark: '#000000',
          DEFAULT: '#7f96ff',
          hover: '#e56399',
          light: '#a6cfd5',
        },
        background: {
          DEFAULT: '#dbfcff',
          light: '#f5feff',
        },
        text: {
          dark: '#000000',
          DEFAULT: '#000000',
          light: '#666',
        },
        accent: {
          pink: '#e56399',
          blue: '#7f96ff',
          teal: '#a6cfd5',
        },
      },
    },
  },
  plugins: [],
}
