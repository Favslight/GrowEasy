import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(99, 102, 241, 0.35)',
        'glow-sm': '0 0 20px -4px rgba(99, 102, 241, 0.25)',
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 32px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 4px 8px rgba(15, 23, 42, 0.06), 0 16px 40px rgba(15, 23, 42, 0.08)',
        'card-dark': '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.08) 0px, transparent 50%)',
        'mesh-dark':
          'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.12) 0px, transparent 50%), radial-gradient(at 0% 80%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};

export default config;
