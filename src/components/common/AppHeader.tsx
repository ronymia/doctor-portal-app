import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import AppText from "./AppText";

interface IAppHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

const AppHeader: React.FC<IAppHeaderProps> = ({
  title,
  showBackButton = true,
  rightAction,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#F8FAFC" : "#0F172A";

  return (
    <View className="h-14 flex-row items-center justify-between px-4 border-b border-brand-border dark:border-dark-border">
      {/* Left */}
      <View className="w-10 items-start">
        {showBackButton && (
          <TouchableOpacity
            className="w-8 h-8 rounded-full bg-brand-border dark:bg-dark-border justify-center items-center"
            onPress={() => router.back()}
          >
            <ChevronLeft size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Center */}
      <View className="flex-1 items-center">
        <AppText
          weight="bold"
          variant="subtitle"
          align="center"
          style={{ fontSize: 16 }}
        >
          {title}
        </AppText>
      </View>

      {/* Right */}
      <View className="w-10 items-end">{rightAction || <View />}</View>
    </View>
  );
};

export default AppHeader;
