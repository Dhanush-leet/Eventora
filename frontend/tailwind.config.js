/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        surface: '#111827',
        accent: {
          primary: '#E31B23',
          secondary: '#7C3AED',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        elegant: ['Playfair Display', 'serif'],
        modern: ['Outfit', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        premium: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      letterSpacing: {
        widest: '.2em',
        tighter: '-.05em'
      }
    },
  },
  plugins: [],
}
