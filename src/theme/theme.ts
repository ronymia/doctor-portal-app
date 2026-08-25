import { Platform } from "react-native";
import colors from "./colors.json";

export const COLORS = colors;

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

export const SHADOWS = Platform.select({
  web: {
    sm: {
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
    },
    md: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.12)",
    },
    lg: {
      boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.16)",
    },
  },
  default: {
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
  },
}) as {
  sm: any;
  md: any;
  lg: any;
};

export const SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 150,
};
