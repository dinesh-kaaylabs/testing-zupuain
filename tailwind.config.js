/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#BFA054',
        secondary: '#800020',
        accent: '#2C6B46',
        background: '#F8F5F2',
        surface: '#FFFFFF',
        text: '#2C2C2C',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        success: '#2E7D32',
        warning: '#B45309',
        error: '#B91C1C'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
