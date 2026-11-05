import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jade: {
          50: '#F5F7F3',
          100: '#E8EEE8',
          200: '#D4E0D8',
          300: '#B3C9BD',
          400: '#84A493',
          500: '#5E8272',
          600: '#456B5C',
          700: '#34574B',
          800: '#26453C',
          900: '#1E3A32',
          950: '#142B25',
        },
        clay: {
          50: '#FDF2EB',
          100: '#F8E3D5',
          200: '#EFC5A9',
          300: '#DFA47C',
          400: '#CB8057',
          500: '#B86542',
          600: '#9D4C32',
          700: '#813D2B',
          800: '#693326',
          900: '#562B22',
        },
        maize: {
          50: '#FBF6E9',
          100: '#F7EED5',
          200: '#F3E5C4',
          300: '#EFD7A1',
          400: '#E4C078',
          500: '#D0A855',
          600: '#B78A3F',
          700: '#936D35',
          800: '#76572E',
          900: '#604728',
        },
        cream: {
          50: '#FFFDF8',
          100: '#FBF7EF',
          200: '#F4EDE0',
          300: '#E8DDC8',
          400: '#DCCBAE',
        },
        ink: '#26322E',
        muted: '#6E746D',
        rose: '#A83E5B',
      },
      fontFamily: {
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        script: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px -24px rgba(20, 43, 37, 0.2)',
        card: '0 28px 70px -40px rgba(20, 43, 37, 0.25)',
        lift: '0 34px 80px -38px rgba(20, 43, 37, 0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      animation: {
        'fade-up': 'fadeUp .9s cubic-bezier(.22,.61,.36,1) both',
        'fade-in': 'fadeIn 1.1s ease both',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'spin-slow': 'spin 26s linear infinite',
        marquee: 'marquee 38s linear infinite',
        'marquee-reverse': 'marqueeReverse 46s linear infinite',
        'pulse-ring': 'pulseRing 2.6s ease-out infinite',
        'draw-line': 'drawLine 2.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(.7)', opacity: '.8' },
          '80%, 100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
