import { useColorScheme } from "react-native";
import { COLORS } from "../theme/theme";

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? COLORS.dark : COLORS.light;

  return {
    isDark,
    theme,
    colors: theme,
  };
};

export default useTheme;
