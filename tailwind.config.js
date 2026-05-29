/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 content paths
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'media', // Uses device color scheme automatically
  theme: {
    extend: {
      colors: {
        // Light theme tokens
        brand: {
          background: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          'text-secondary': '#475569',
          'text-muted': '#94A3B8',
          primary: '#0F766E',
          'primary-light': '#CCFBF1',
          'primary-dark': '#115E59',
          accent: '#3B82F6',
          'accent-light': '#DBEAFE',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        // Dark theme tokens (used via dark: prefix)
        dark: {
          background: '#0B0F19',
          surface: '#151D30',
          border: '#222F4C',
          text: '#F8FAFC',
          'text-secondary': '#94A3B8',
          'text-muted': '#64748B',
          primary: '#14B8A6',
          'primary-light': '#115E59',
          'primary-dark': '#0D9488',
          accent: '#60A5FA',
          'accent-light': '#1E3A8A',
          success: '#34D399',
          warning: '#FBBF24',
          error: '#F87171',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        xxl: '28px',
        xxxl: '36px',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        xxl: '28px',
      },
      fontSize: {
        xs: ['11px', { lineHeight: '14px' }],
        sm: ['13px', { lineHeight: '18px' }],
        md: ['15px', { lineHeight: '20px' }],
        lg: ['18px', { lineHeight: '24px' }],
        xl: ['22px', { lineHeight: '28px' }],
        xxl: ['28px', { lineHeight: '34px' }],
        title: ['34px', { lineHeight: '40px' }],
      },
    },
  },
  plugins: [],
};
