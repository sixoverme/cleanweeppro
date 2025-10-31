/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1E40AF',
        'brand-secondary': '#3B82F6',
        'brand-light': '#DBEAFE',
        'brand-dark': '#1E3A8A',
      },
    },
  },
  plugins: [],
}
