import React, { useState } from 'react';
import { View, TextInput, useColorScheme, TextInputProps } from 'react-native';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import { Phone } from 'lucide-react-native';
import AppText from '../common/AppText';

interface AppPhoneInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
}

export const AppPhoneInput: React.FC<AppPhoneInputProps> = ({
  name,
  control,
  label,
  placeholder = '17XXXXXXXX',
  rules,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isFocused, setIsFocused] = useState(false);

  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const secondaryColor = isDark ? '#94A3B8' : '#475569';
  const placeholderColor = isDark ? '#64748B' : '#94A3B8';
  const iconColor = isDark ? '#64748B' : '#94A3B8';
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
              <View className="mr-2 justify-center items-center">
                <Phone size={18} color={iconColor} />
              </View>
              <AppText
                weight="medium"
                className="mr-2 text-[15px]"
                color={secondaryColor}
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
                  const sanitized = text.replace(/[^0-9]/g, '');
                  onChange(sanitized);
                }}
                value={value || ''}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
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

export default AppPhoneInput;
