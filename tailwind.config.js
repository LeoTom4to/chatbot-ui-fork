/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 8px 0 #34d39966' },
          '50%':      { boxShadow: '0 0 16px 3px #34d399aa' },
        },
      },
      animation: {
        glow: 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  variants: {
    extend: {
      visibility: ["group-hover"],
    },
   },
  plugins: [require('@tailwindcss/typography')],
};
