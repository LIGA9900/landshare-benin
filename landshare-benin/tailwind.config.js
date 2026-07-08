/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind va scanner ces fichiers pour trouver les classes utilisées
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Nos couleurs personnalisées LandShare Bénin
      colors: {
        navy: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#1A56A0',
          600: '#1A4A8A',
          900: '#0F2558',
        },
        teal: {
          500: '#0B7A75',
          600: '#0A6B66',
        },
        amber: {
          500: '#E07B00',
          600: '#C96E00',
        }
      },
      // Nos polices
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}