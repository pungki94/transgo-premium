/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#0F172A',   /* Slate 900 */
        'accent': '#EAB308',    /* Yellow 500 (Warna khas logistik) */
        'secondary': '#64748B', /* Slate 500 */
        'surface': '#F8FAFC',  /* Slate 50 */
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}