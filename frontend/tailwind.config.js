/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#F8F8F8',
        surfaceAlt: '#FFFFFF',
        at: {
          red: '#E31B23', // American Tourister Red
          black: '#111111',
          gray: '#666666',
          lightGray: '#EBEBEB'
        },
        accent: {
          primary: '#E31B23',
          secondary: '#7C3AED',
          gold: '#FFD700'
        },
        text: {
          primary: '#111111',
          secondary: '#666666',
          muted: '#999999'
        }
      },
      fontFamily: {
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        bms: '0 4px 10px rgba(0,0,0,0.05)',
        elevate: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        at: '0 10px 30px rgba(0,0,0,0.05)'
      },
      letterSpacing: {
        widest: '.2em',
        tighter: '-.05em'
      }
    },
  },
  plugins: [],
}
