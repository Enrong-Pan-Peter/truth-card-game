/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FFF8EB',
        'blue-primary': '#4D7491',
        'orange-primary': '#ECB68C',
        ink: '#282828',
        'gray-secondary': '#656565',
        'pale-pink': '#D0B7B0',
      },
      fontFamily: {
        // English handwritten (falls back to Ma Shan Zheng for CJK glyphs)
        hand: ["'Patrick Hand'", "'Ma Shan Zheng'", 'cursive'],
        // Chinese handwritten
        zh: ["'Ma Shan Zheng'", "'Patrick Hand'", "'Crimson Text'", 'cursive'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(40, 40, 40, 0.10)',
        btn: '0 4px 14px rgba(77, 116, 145, 0.35)',
        'btn-orange': '0 4px 12px rgba(236, 182, 140, 0.40)',
      },
    },
  },
  plugins: [],
}
