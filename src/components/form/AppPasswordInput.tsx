import { Eye, EyeOff, Lock } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import AppText from "../common/AppText";

interface AppPasswordInputProps extends Omit<
  TextInputProps,
  "onChangeText" | "value" | "secureTextEntry"
> {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
}

export const AppPasswordInput: React.FC<AppPasswordInputProps> = ({
  name,
  control,
  label,
  placeholder = "••••••••",
  rules,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(true);

  const textColor = isDark ? "#F8FAFC" : "#0F172A";
  const placeholderColor = isDark ? "#64748B" : "#94A3B8";
  const surfaceBg = isDark ? "#151D30" : "#FFFFFF";
  const iconColor = isDark ? "#64748B" : "#94A3B8";
  const toggleIconColor = isDark ? "#94A3B8" : "#475569";

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
          ? isDark
            ? "#F87171"
            : "#EF4444"
          : isFocused
            ? isDark
              ? "#14B8A6"
              : "#0F766E"
            : isDark
              ? "#222F4C"
              : "#E2E8F0";

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
};

export default AppPasswordInput;
