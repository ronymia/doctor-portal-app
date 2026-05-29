export const COLORS = {
  light: {
    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',
    surfaceBorder: '#E2E8F0', // Slate 200
    text: '#0F172A', // Slate 900
    textSecondary: '#475569', // Slate 600
    textMuted: '#94A3B8', // Slate 400
    primary: '#0F766E', // Teal 700
    primaryLight: '#CCFBF1', // Teal 100
    primaryDark: '#115E59', // Teal 800
    accent: '#3B82F6', // Blue 500
    accentLight: '#DBEAFE', // Blue 100
    success: '#10B981', // Emerald 500
    warning: '#F59E0B', // Amber 500
    error: '#EF4444', // Red 500
    glass: 'rgba(255, 255, 255, 0.75)',
    shadow: 'rgba(15, 23, 42, 0.08)',
  },
  dark: {
    background: '#0B0F19', // Premium Dark Blue-Slate
    surface: '#151D30', // Deep Slate Blue
    surfaceBorder: '#222F4C', // Medium slate border
    text: '#F8FAFC', // Slate 50
    textSecondary: '#94A3B8', // Slate 400
    textMuted: '#64748B', // Slate 500
    primary: '#14B8A6', // Teal 500
    primaryLight: '#115E59', // Teal 800
    primaryDark: '#0D9488', // Teal 600
    accent: '#60A5FA', // Blue 400
    accentLight: '#1E3A8A', // Blue 900
    success: '#34D399', // Emerald 400
    warning: '#FBBF24', // Amber 400
    error: '#F87171', // Red 400
    glass: 'rgba(21, 29, 48, 0.75)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    title: 34,
  },
  lineHeight: {
    xs: 14,
    sm: 18,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 34,
    title: 40,
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 150,
};
