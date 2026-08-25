import React from "react";
import { Text as RNText, TextProps } from "react-native";

interface IAppTextProps extends TextProps {
  variant?:
    | "title"
    | "subtitle"
    | "body"
    | "bodySecondary"
    | "caption"
    | "label"
    | "error";
  weight?: "regular" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  color?: string;
}

const variantClasses: Record<NonNullable<IAppTextProps["variant"]>, string> = {
  title: "text-[34px] leading-[40px] text-brand-text",
  subtitle: "text-[22px] leading-[28px] text-brand-text",
  body: "text-[15px] leading-[20px] text-brand-text",
  bodySecondary: "text-[13px] leading-[18px] text-brand-text-secondary",
  caption: "text-[11px] leading-[14px] text-brand-text-muted",
  label: "text-[13px] leading-[18px] text-brand-text-secondary",
  error: "text-[11px] leading-[14px] text-brand-error",
};

const weightClasses: Record<NonNullable<IAppTextProps["weight"]>, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const alignClasses: Record<NonNullable<IAppTextProps["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const AppText: React.FC<IAppTextProps> = ({
  children,
  style,
  variant = "body",
  weight = "regular",
  align = "left",
  color,
  className,
  ...props
}) => {
  const classes = [
    variantClasses[variant],
    weightClasses[weight],
    alignClasses[align],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <RNText
      className={classes}
      style={[color ? { color } : null, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default AppText;
