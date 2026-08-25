import { useTheme } from "@/src/hooks/useTheme";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

interface IAppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  icon,
}: IAppButtonProps) {
  const { colors } = useTheme();
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: false,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: false,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const getButtonClass = () => {
    const base =
      "h-[52px] rounded-md justify-center items-center px-5 flex-row shadow-sm";
    const opacity = disabled || loading ? "opacity-60" : "";

    switch (variant) {
      case "primary":
        return `${base} bg-brand-primary dark:bg-dark-primary ${opacity}`;
      case "secondary":
        return `${base} bg-brand-accent dark:bg-dark-accent ${opacity}`;
      case "outline":
        return `${base} bg-transparent border-[1.5px] border-brand-primary dark:border-dark-primary ${opacity}`;
      case "text":
        return `${base} bg-transparent shadow-none py-2 ${opacity}`;
      default:
        return `${base} bg-brand-primary dark:bg-dark-primary ${opacity}`;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
      case "secondary":
        return "#FFFFFF";
      case "outline":
      case "text":
        return colors.primary;
      default:
        return "#FFFFFF";
    }
  };

  const spinnerColor =
    variant === "outline" || variant === "text" ? colors.primary : "#FFFFFF";

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={disabled || loading ? undefined : handlePressIn}
        onPressOut={disabled || loading ? undefined : handlePressOut}
        className={getButtonClass()}
      >
        {loading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : (
          <Animated.View className="flex-row items-center justify-center">
            {icon && <Animated.View className="mr-2">{icon}</Animated.View>}
            <AppText weight="semibold" color={getTextColor()}>
              {title}
            </AppText>
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}
