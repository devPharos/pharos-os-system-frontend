import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)'],
      },
      colors: {
        red: {
          50: '#FFEAE6',
          100: '#FFBEB0',
          200: '#FF9F8A',
          300: '#FF7354',
          400: '#FF5833',
          500: '#FF3B10',
          600: '#E82A00',
          700: '#B52100',
          800: '#8C1900',
          900: '#6B1300',
        },
        orange: {
          50: '#FFF5E6',
          100: '#FFDFB0',
          200: '#FFD08A',
          300: '#FFBB54',
          400: '#FFAD33',
          500: '#FF9900',
          600: '#E88B00',
          700: '#B56D00',
          800: '#8C5400',
          900: '#6B4000',
        },
        yellow: {
          50: '#FFFAE6',
          100: '#FFF0B0',
          200: '#FFE88A',
          300: '#FFDE54',
          400: '#FFD833',
          500: '#FFCE00',
          600: '#E8BB00',
          700: '#B59200',
          800: '#8C7100',
          900: '#6B5700',
        },
        green: {
          50: '#E6FCE6',
          100: '#B2F4B0',
          200: '#8CEF8A',
          300: '#58E855',
          400: '#37E334',
          500: '#05DC01',
          600: '#05C801',
          700: '#049C01',
          800: '#037901',
          900: '#025C00',
        },
        blue: {
          50: '#E6F4FC',
          100: '#B0DCF4',
          200: '#8ACBEF',
          300: '#55B3E8',
          400: '#34A4E3',
          500: '#018DDC',
          600: '#0180C8',
          700: '#01649C',
          800: '#014E79',
          900: '#003B5C',
        },
        gray: {
          50: '#FFFFFF',
          100: '#E6E6E6',
          200: '#B3B3B3',
          300: '#999999',
          400: '#4D4D4D',
          500: '#414141',
          600: '#1C1C1C',
          700: '#1A1A1A',
          800: '#111111',
          900: '#0E0E0E',
          950: '#000000',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      addCommonColors: true,
    }),
  ],
}
export default config
