import React, { useState } from 'react';
import { View, TextInput, useColorScheme, TextInputProps } from 'react-native';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import AppText from '../common/AppText';

interface AppInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  icon?: React.ReactNode;
  onChangeText?: (text: string) => void;
}

export const AppInput: React.FC<AppInputProps> = ({
  name,
  control,
  label,
  placeholder,
  rules,
  icon,
  style,
  keyboardType = 'default',
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isFocused, setIsFocused] = useState(false);

  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const placeholderColor = isDark ? '#64748B' : '#94A3B8';
  const surfaceBg = isDark ? '#151D30' : '#FFFFFF';

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const borderColor = error
          ? isDark ? '#F87171' : '#EF4444'
          : isFocused
          ? isDark ? '#14B8A6' : '#0F766E'
          : isDark ? '#222F4C' : '#E2E8F0';

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
              {icon && <View className="mr-2 justify-center items-center">{icon}</View>}
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
                value={value || ''}
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
                {error.message || 'Required field'}
              </AppText>
            )}
          </View>
        );
      }}
    />
  );
};

export default AppInput;
