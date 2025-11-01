/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          cream: '#F5E6D3',
          sand: '#E8D5C4',
          peach: '#FFD7BA',
          coral: '#FF9E80',
          brown: {
            light: '#8D6E63',
            DEFAULT: '#6D4C41',
            dark: '#5D4037',
          },
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Quicksand', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
