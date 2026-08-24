/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0756A3',
          dark: '#063B72',
          light: '#EAF4FF',
          soft: '#F3F8FD',
        },
        background: '#F6F8FB',
        surface: '#FFFFFF',
        success: {
          DEFAULT: '#15803D',
          light: '#ECFDF3',
        },
        warning: {
          DEFAULT: '#B45309',
          light: '#FFF7E8',
        },
        danger: {
          DEFAULT: '#C62828',
          light: '#FFF0F0',
        },
        ink: {
          DEFAULT: '#102A43',
          muted: '#62748A',
        },
        border: '#DDE5EE',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 32px rgba(15, 63, 106, 0.08)',
        soft: '0 4px 16px rgba(15, 63, 106, 0.06)',
      },
      borderRadius: {
        card: '1.25rem',
      },
    },
  },
  plugins: [],
};
