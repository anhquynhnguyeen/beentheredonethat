/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm neutral palette — the entire design system
        parchment: {
          50:  '#fdfcf8',
          100: '#f8f5ee',
          200: '#f0ece0',
          300: '#e4dece',
          400: '#d4ccb8',
          500: '#b8ae98',
          600: '#9a8f78',
          700: '#7a7060',
          800: '#5a5248',
          900: '#3a3430',
        },
        ink: {
          50:  '#f5f4f2',
          100: '#e8e6e1',
          200: '#ccc9c0',
          300: '#a8a49a',
          400: '#7e7a70',
          500: '#5c584f',
          600: '#44413a',
          700: '#302e28',
          800: '#1e1c18',
          900: '#100f0c',
        },
        accent: '#8b6f4e', // Warm brown — used very sparingly
      },
      fontFamily: {
        serif:  ['"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"Inter"', 'system-ui', 'sans-serif'],
        mono:   ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
}
