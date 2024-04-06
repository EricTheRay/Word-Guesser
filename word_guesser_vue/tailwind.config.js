/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');
const { parseColor } = require('tailwindcss/lib/util/color')

const toRGB = function(value) {
  return parseColor(value).color.join(' ');
};

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'main': 'rgb(var(--color-main) / <alpha-value>)', 
        'sub': 'rgb(var(--color-sub) / <alpha-value>)', 
        'background': 'rgb(var(--color-background) / <alpha-value>)', 
        'inactive': 'rgb(var(--color-inactive) / <alpha-value>)', 
        'active': 'rgb(var(--color-active) / <alpha-value>)', 
        'positive': 'rgb(var(--color-positive) / <alpha-value>)', 
        'negative': 'rgb(var(--color-negative) / <alpha-value>)', 
        'empty': 'rgb(var(--color-empty) / <alpha-value>)', 
        'inserted': 'rgb(var(--color-inserted) / <alpha-value>)', 
        'available': 'rgb(var(--color-available) / <alpha-value>)', 
        'flipped-colored': 'rgb(var(--color-flipped-colored) / <alpha-value>)', 
        'flipped-uncolored': 'rgb(var(--color-flipped-uncolored) / <alpha-value>)', 
        'absent': 'rgb(var(--color-absent) / <alpha-value>)', 
        'present': 'rgb(var(--color-present) / <alpha-value>)', 
        'correct': 'rgb(var(--color-correct) / <alpha-value>)', 
      }, 
      fontFamily: {
        'inter': "'Inter'", 
        'merriweather': "'Merriweather', 'san-serif'", 
      }, 
    },
  },
  plugins: [
    plugin(function({ addUtilities, theme }) {
      addUtilities({
        '.theme-light': {
          '--color-main': toRGB(theme('colors.white')), 
          '--color-sub': toRGB(theme('colors.white')), 
          '--color-background': toRGB(theme('colors.gray.300')), 
          '--color-inactive': toRGB(theme('colors.gray.400')), 
          '--color-positive': toRGB(theme('colors.black')), 
          '--color-negative': toRGB(theme('colors.white')), 
          '--color-empty': toRGB(theme('colors.gray.300')), 
          '--color-inserted': toRGB(theme('colors.gray.600')), 
          '--color-available': toRGB(theme('colors.gray.300')), 
          '--color-flipped-colored': toRGB(theme('colors.white')), 
          '--color-flipped-uncolored': toRGB(theme('colors.white')), 
          '--color-absent': toRGB(theme('colors.gray.500')), 
        }, 
      
        '.theme-dark': {
          '--color-main': toRGB(theme('colors.gray.900')), 
          '--color-sub': toRGB(theme('colors.gray.800')), 
          '--color-background': toRGB(theme('colors.black')), 
          '--color-inactive': toRGB(theme('colors.gray.400')), 
          '--color-positive': toRGB(theme('colors.white')), 
          '--color-negative': toRGB(theme('colors.white')), 
          '--color-empty': toRGB(theme('colors.gray.700')), 
          '--color-inserted': toRGB(theme('colors.gray.600')), 
          '--color-available': toRGB(theme('colors.gray.500')), 
          '--color-flipped-colored': toRGB(theme('colors.white')), 
          '--color-flipped-uncolored': toRGB(theme('colors.white')), 
          '--color-absent': toRGB(theme('colors.gray.700')), 
        }, 
      
        '.theme-normal-contrast': {
          '--color-active': toRGB(theme('colors.green.500')), 
          '--color-present': toRGB(theme('colors.yellow.500')), 
          '--color-correct': toRGB(theme('colors.green.500')), 
        }, 
      
        '.theme-high-contrast': {
          '--color-active': toRGB(theme('colors.orange.500')), 
          '--color-flipped-colored': toRGB(theme('colors.black')), 
          '--color-present': toRGB(theme('colors.sky.400')), 
          '--color-correct': toRGB(theme('colors.orange.500')), 
        }, 
      });
    }),
  ],
};

