/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#E0F2FE', // Biru background pudar
          main: '#38BDF8',  // Biru tombol (Cyan-ish)
          dark: '#0284C7',  // Biru teks/border gelap
          text: '#0F172A',  // Warna teks hitam/abu gelap
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(56, 189, 248, 0.5)',
      }
    },
  },
  plugins: [],
}