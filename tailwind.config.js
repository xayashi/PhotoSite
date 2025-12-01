/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Mono', 'monospace'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        accent: '#C41E3A',
        crimson: {
          DEFAULT: '#C41E3A',
          50: '#F9E5E9',
          100: '#F2C7CF',
          200: '#E58FA0',
          300: '#D85770',
          400: '#CB2F4F',
          500: '#C41E3A',
          600: '#9E182F',
          700: '#781224',
          800: '#520C18',
          900: '#2C060D',
        },
      },
    },
  },
  plugins: [],
}
