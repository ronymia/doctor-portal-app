const colors = require('./src/theme/colors.json');

const mapThemeToTailwind = (theme) => ({
  background: theme.background,
  surface: theme.surface,
  border: theme.surfaceBorder,
  text: theme.text,
  'text-secondary': theme.textSecondary,
  'text-muted': theme.textMuted,
  primary: theme.primary,
  'primary-light': theme.primaryLight,
  'primary-dark': theme.primaryDark,
  accent: theme.accent,
  'accent-light': theme.accentLight,
  success: theme.success,
  warning: theme.warning,
  error: theme.error,
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 content paths
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class', // Manual class mode (prevents automatic media dark mode)
  theme: {
    extend: {
      colors: {
        brand: mapThemeToTailwind(colors.light),
        dark: mapThemeToTailwind(colors.dark),
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
