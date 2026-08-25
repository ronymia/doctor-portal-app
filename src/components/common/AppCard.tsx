import React from "react";
import { View, ViewStyle } from "react-native";

interface IAppCardProps {
  readonly children: React.ReactNode;
  readonly style?: ViewStyle;
  readonly padding?: number;
  readonly bordered?: boolean;
  readonly className?: string;
}

export default function AppCard({
  children,
  style,
  padding,
  bordered = true,
  className,
}: IAppCardProps) {
  const baseClass = [
    "rounded-md bg-white",
    "shadow-sm",
    bordered ? "border border-brand-border" : "border-0",
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
}
