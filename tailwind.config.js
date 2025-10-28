/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          dark: '#131921',
          navy: '#232F3E',
          orange: '#FF9900',
          success: '#067D62',
          warning: '#F0C14B',
          error: '#C7302A',
          info: '#007185',
        },
        background: '#F3F3F3',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'cart-bounce': 'cartBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        cartBounce: {
          '0%, 20%, 60%, 100%': { transform: 'translateY(0) scale(1)' },
          '40%': { transform: 'translateY(-4px) scale(1.1)' },
          '80%': { transform: 'translateY(-2px) scale(1.05)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}