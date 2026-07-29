import { useTheme } from "@/src/hooks/useTheme";
import { ActivityIndicator, View } from "react-native";
import AppText from "./AppText";

interface IAppLoaderProps {
  message?: string;
  overlay?: boolean;
}

export default function AppLoader({
  message,
  overlay = false,
}: IAppLoaderProps) {
  const { colors } = useTheme();
  const primaryColor = colors.primary;

  if (overlay) {
    return (
      <View className="absolute inset-0 justify-center items-center z-[9999] bg-black/40">
        <View className="p-6 rounded-2xl bg-white dark:bg-dark-surface items-center min-w-[120px] shadow-lg">
          <ActivityIndicator size="large" color={primaryColor} />
          {message && (
            <AppText
              className="mt-3 text-center"
              weight="medium"
              variant="bodySecondary"
            >
              {message}
            </AppText>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-6">
      <ActivityIndicator size="large" color={primaryColor} />
      {message && (
        <AppText
          className="mt-3 text-center"
          weight="medium"
          variant="bodySecondary"
        >
          {message}
        </AppText>
      )}
    </View>
  );
}
