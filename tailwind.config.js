/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        night: {
          800: '#0b1329',
          900: '#070d18',
          950: '#030712'
        }
      },
      fontFamily: {
        thai: ['Prompt', 'Kanit', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s infinite alternate',
        'float-breath': 'float-breath 2.5s ease-in-out infinite alternate',
        'heart-beat': 'heart-beat 1.5s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)' },
        },
        'float-breath': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        'heart-beat': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
}
