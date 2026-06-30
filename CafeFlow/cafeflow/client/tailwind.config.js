/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff7a00',
          600: '#ea6c00',
          700: '#c2570a',
          800: '#9a4a10',
          900: '#7c3e10',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(255, 122, 0, 0.08)',
        card: '0 8px 30px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'orange-gradient': 'linear-gradient(135deg, #ff7a00 0%, #ff9a44 100%)',
        'orange-light': 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
