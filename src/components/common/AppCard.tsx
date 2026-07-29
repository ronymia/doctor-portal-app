import React from "react";
import { View, ViewStyle } from "react-native";

interface IAppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  bordered?: boolean;
  className?: string;
}

const AppCard: React.FC<IAppCardProps> = ({
  children,
  style,
  padding,
  bordered = true,
  className,
}) => {
  const baseClass = [
    "rounded-md bg-white dark:bg-dark-surface",
    "shadow-sm",
    bordered
      ? "border border-brand-border dark:border-dark-border"
      : "border-0",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Padding can be passed as a number for dynamic values
  const inlineStyle: ViewStyle = {};
  if (padding !== undefined) {
    inlineStyle.padding = padding;
  } else {
    inlineStyle.padding = 12; // default md spacing
  }

  return (
    <View className={baseClass} style={[inlineStyle, style]}>
      {children}
    </View>
  );
};

export default AppCard;
