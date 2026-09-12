/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        dancing: ['"Dancing Script"', 'cursive'],
      },
      colors: {
        brand: {
          50: '#f3f6f3',
          100: '#e3ebe4',
          200: '#c6d6c9',
          300: '#9fb6a5',
          400: '#75937c',
          500: '#55765d',
          600: '#425d49',
          700: '#364b3c',
          800: '#2d3d32',
          900: '#263329',
          950: '#1a241c',
        },
        ink: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0f0e0d',
        }
      },
      letterSpacing: {
        tightest: '-0.04em',
      }
    },
  },
  plugins: [],
}
