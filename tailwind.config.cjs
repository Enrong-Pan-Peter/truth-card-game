/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New color scheme
        ivory: '#FFF8EB',
        'pure-white': '#FFFFFF',
        'blue-primary': '#4D7491',
        'orange-primary': '#ECB68C',
        'black-primary': '#282828',
        'gray-secondary': '#656565',
        'pale-pink': '#D0B7B0',
        
        // Keep warm colors for compatibility
        warm: {
          cream: '#FFF8EB',  // Updated to ivory
          sand: '#FFFFFF',    // Updated to white
          peach: '#ECB68C',   // Updated to orange
          coral: '#4D7491',   // Updated to blue
          brown: {
            light: '#D0B7B0', // Updated to pale pink
            DEFAULT: '#656565', // Updated to gray
            dark: '#282828',   // Updated to black
          },
        },
      },
      fontFamily: {
        sans: ['Ma Shan Zheng', 'Crimson Text', 'Georgia', 'serif'],
        display: ['Caveat', 'cursive'],
        handwritten: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}
