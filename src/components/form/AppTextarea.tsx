import AppText from "@/src/components/common/AppText";
import { useTheme } from "@/src/hooks/useTheme";
import { useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import { TextInput, TextInputProps, View } from "react-native";

interface IAppTextareaProps extends Omit<
  TextInputProps,
  "onChangeText" | "value" | "multiline"
> {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  numberOfLines?: number;
}

export default function AppTextarea({
  name,
  control,
  label,
  placeholder,
  rules,
  numberOfLines = 4,
  style,
  ...props
}: IAppTextareaProps) {
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

        const areaHeight = numberOfLines * 24 + 20;

        return (
          <View className="mb-3 w-full">
            {label && (
              <AppText weight="medium" variant="label" className="mb-1">
                {label}
              </AppText>
            )}
            <View
              className="border-[1.5px] rounded-md px-3 py-2"
              style={{
                backgroundColor: surfaceBg,
                borderColor,
                height: areaHeight,
              }}
            >
              <TextInput
                multiline
                numberOfLines={numberOfLines}
                onBlur={() => {
                  onBlur();
                  setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                onChangeText={onChange}
                value={value || ""}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                textAlignVertical="top"
                className="flex-1 text-[15px]"
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
