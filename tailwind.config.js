import { fontSize, margin, padding, width } from './myTailwindClasses/newclasses'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#243c5a',
      },
      fontSize: fontSize,
      margin: margin,
      padding: padding,
      width: width,
    },
  },
  plugins: [],
}