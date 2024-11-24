/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--accent-color)',
          hover: 'var(--accent-color-hover)',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-600',
    'bg-purple-600',
    'bg-green-600',
    'bg-red-600',
    'bg-orange-600',
    'bg-pink-600',
    'bg-indigo-600',
    'bg-teal-600',
    'bg-blue-50',
    'bg-purple-50',
    'bg-green-50',
    'bg-red-50',
    'bg-orange-50',
    'bg-pink-50',
    'bg-indigo-50',
    'bg-teal-50',
    'border-blue-600',
    'border-purple-600',
    'border-green-600',
    'border-red-600',
    'border-orange-600',
    'border-pink-600',
    'border-indigo-600',
    'border-teal-600',
  ],
};