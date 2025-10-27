/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: { card: '0 8px 24px rgba(0,0,0,0.08)' },
      colors: {
        brand: { 50:'#eef2ff',100:'#e0e7ff',500:'#4f46e5',600:'#4338ca',700:'#3730a3' }
      }
    },
  },
  plugins: [],
};
