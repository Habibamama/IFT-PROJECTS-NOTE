/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F7F4',
        card: '#FFFFFF',
        ink: '#14181F',
        slate: '#5C6370',
        line: '#E1E2DC',
        pine: '#2D5C4D',
        'pine-dark': '#1F4338',
        clay: '#B5462F',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
      },
    },
  },
  plugins: [],
}
