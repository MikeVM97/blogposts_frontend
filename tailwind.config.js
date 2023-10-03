import { fontSize, margin, padding, width } from './myTailwindClasses/newclasses'

/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss/types/config').PluginCreator} */

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
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.phong': {
          color: 'cyan',
        }
      });
    }
  ]
}