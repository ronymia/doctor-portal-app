import AppText from "@/src/components/common/AppText";
import { useTheme } from "@/src/hooks/useTheme";
import { Eye, EyeOff, Lock } from "lucide-react-native";
import { useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface IAppPasswordInputProps extends Omit<
  TextInputProps,
  "onChangeText" | "value" | "secureTextEntry"
> {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
}

export default function AppPasswordInput({
  name,
  control,
  label,
  placeholder = "••••••••",
  rules,
  style,
  ...props
}: IAppPasswordInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(true);

  const textColor = colors.text;
  const placeholderColor = colors.textMuted;
  const surfaceBg = colors.surface;
  const iconColor = colors.textMuted;
  const toggleIconColor = colors.textSecondary;

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
                <Lock size={18} color={iconColor} />
              </View>
              <TextInput
                secureTextEntry={isSecure}
                onBlur={() => {
                  onBlur();
                  setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                onChangeText={onChange}
                value={value || ""}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                className="flex-1 h-full text-[15px]"
                style={[{ color: textColor }, style]}
                {...props}
              />
              <TouchableOpacity
                onPress={() => setIsSecure(!isSecure)}
                className="p-1 justify-center items-center"
              >
                {isSecure ? (
                  <Eye size={18} color={toggleIconColor} />
                ) : (
                  <EyeOff size={18} color={toggleIconColor} />
                )}
              </TouchableOpacity>
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
