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
          cream: '#CEA0AE',
          sand: '#D5B0AC',
          peach: '#684551',
          coral: '#402E2A',
          brown: {
            light: '#8D6E63',
            DEFAULT: '#6D4C41',
            dark: '#402E2A',
          },
        },
      },
      fontFamily: {
        sans: ['Crimson Text', 'Georgia', 'serif'],
        display: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
