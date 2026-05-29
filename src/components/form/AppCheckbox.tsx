import React from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import { Check } from 'lucide-react-native';
import AppText from '../common/AppText';

interface AppCheckboxProps {
  name: string;
  control: any;
  label: string;
  rules?: RegisterOptions;
}

export const AppCheckbox: React.FC<AppCheckboxProps> = ({
  name,
  control,
  label,
  rules,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const primaryColor = isDark ? '#14B8A6' : '#0F766E';
  const errorColor = isDark ? '#F87171' : '#EF4444';

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="mb-3 w-full">
          <TouchableOpacity
            onPress={() => onChange(!value)}
            activeOpacity={0.7}
            className="flex-row items-center"
          >
            <View
              className="w-[22px] h-[22px] rounded-[4px] border-2 justify-center items-center mr-2"
              style={{
                borderColor: error ? errorColor : primaryColor,
                backgroundColor: value ? primaryColor : 'transparent',
              }}
            >
              {value && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
            </View>
            <AppText variant="body" className="flex-1">
              {label}
            </AppText>
          </TouchableOpacity>
          {error && (
            <AppText variant="error" className="mt-1 ml-[30px]">
              {error.message || 'Required field'}
            </AppText>
          )}
        </View>
      )}
    />
  );
};

export default AppCheckbox;
