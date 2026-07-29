import AppText from "@/src/components/common/AppText";
import { useTheme } from "@/src/hooks/useTheme";
import { Phone } from "lucide-react-native";
import { useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import { TextInput, TextInputProps, View } from "react-native";

interface IAppPhoneInputProps extends Omit<
  TextInputProps,
  "onChangeText" | "value"
> {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
}

export default function AppPhoneInput({
  name,
  control,
  label,
  placeholder = "17XXXXXXXX",
  rules,
  style,
  ...props
}: IAppPhoneInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const textColor = colors.text;
  const placeholderColor = colors.textMuted;
  const iconColor = colors.textMuted;
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
              <View className="mr-2 justify-center items-center">
                <Phone size={18} color={iconColor} />
              </View>
              <AppText
                weight="medium"
                className="mr-2 text-[15px] text-brand-text-secondary dark:text-dark-text-secondary"
              >
                +880
              </AppText>
              <TextInput
                keyboardType="phone-pad"
                onBlur={() => {
                  onBlur();
                  setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                onChangeText={(text) => {
                  const sanitized = text.replace(/[^0-9]/g, "");
                  onChange(sanitized);
                }}
                value={value || ""}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
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
