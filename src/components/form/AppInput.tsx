import AppText from "@/src/components/common/AppText";
import { useTheme } from "@/src/hooks/useTheme";
import React, { useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import { TextInput, TextInputProps, View } from "react-native";

interface IAppInputProps extends Omit<
  TextInputProps,
  "onChangeText" | "value"
> {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  icon?: React.ReactNode;
  onChangeText?: (text: string) => void;
}

export default function AppInput({
  name,
  control,
  label,
  placeholder,
  rules,
  icon,
  style,
  keyboardType = "default",
  ...props
}: IAppInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const textColor = colors.text;
  const placeholderColor = colors.textMuted;
  const surfaceBg = colors.surface;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        const borderColor = error
          ? colors.error
          : isFocused
            ? colors.primary
            : colors.surfaceBorder;

        return (
          <View className="mb-3 w-full">
            {label && (
              <AppText weight="medium" variant="label" className="mb-1">
                {label}
              </AppText>
            )}
            <View
              className="h-[52px] border-[1.5px] rounded-md flex-row items-center px-3"
              style={{ backgroundColor: surfaceBg, borderColor }}
            >
              {icon && (
                <View className="mr-2 justify-center items-center">{icon}</View>
              )}
              <TextInput
                onBlur={() => {
                  onBlur();
                  setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                onChangeText={(text) => {
                  onChange(text);
                  if (props.onChangeText) props.onChangeText(text);
                }}
                value={value || ""}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                keyboardType={keyboardType}
                className="flex-1 h-full text-[15px]"
                style={[{ color: textColor }, style]}
                {...props}
              />
            </View>
            {error && (
              <AppText variant="error" className="mt-1">
                {error.message || "Required field"}
              </AppText>
            )}
          </View>
        );
      }}
    />
  );
}
