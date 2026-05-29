import React, { useState } from 'react';
import { View, TextInput, useColorScheme, TextInputProps } from 'react-native';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import AppText from '../common/AppText';

interface AppTextareaProps extends Omit<TextInputProps, 'onChangeText' | 'value' | 'multiline'> {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  numberOfLines?: number;
}

export const AppTextarea: React.FC<AppTextareaProps> = ({
  name,
  control,
  label,
  placeholder,
  rules,
  numberOfLines = 4,
  style,
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
              style={{ backgroundColor: surfaceBg, borderColor, height: areaHeight }}
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
                value={value || ''}
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
                {error.message || 'Required field'}
              </AppText>
            )}
          </View>
        );
      }}
    />
  );
};

export default AppTextarea;
