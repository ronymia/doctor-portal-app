import { useColorScheme } from "react-native";
import { COLORS } from "../theme/theme";

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = false;
  const theme = COLORS.light;

  return {
    isDark,
    theme: theme,
    colors: theme,
  };
};

export default useTheme;
