/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4500',
        secondary: '#0079D3',
        accent: '#46D160',
        warning: '#FFB000',
        error: '#EA0027',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '12px',
        xs: '14px',
        sm: '16px',
        base: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
      },
      animation: {
        'vote-scale': 'scale 150ms ease-out',
        'card-lift': 'lift 200ms ease-out',
      },
      keyframes: {
        scale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
      },
    },
  },
  plugins: [],
}