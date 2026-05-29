import React from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import AppText from '../common/AppText';

interface RadioOption {
  label: string;
  value: string | number;
}

interface AppRadioProps {
  name: string;
  control: any;
  options: RadioOption[];
  label?: string;
  rules?: RegisterOptions;
  horizontal?: boolean;
}

export const AppRadio: React.FC<AppRadioProps> = ({
  name,
  control,
  options,
  label,
  rules,
  horizontal = false,
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
          {label && (
            <AppText weight="medium" variant="label" className="mb-1">
              {label}
            </AppText>
          )}

          <View className={horizontal ? 'flex-row flex-wrap gap-3' : 'flex-col'}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <TouchableOpacity
                  key={option.value.toString()}
                  onPress={() => onChange(option.value)}
                  activeOpacity={0.7}
                  className={`flex-row items-center ${horizontal ? '' : 'py-2'}`}
                >
                  <View
                    className="w-[22px] h-[22px] rounded-full border-2 justify-center items-center mr-2"
                    style={{ borderColor: error ? errorColor : primaryColor }}
                  >
                    {isSelected && (
                      <View
                        className="w-[10px] h-[10px] rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      />
                    )}
                  </View>
                  <AppText>{option.label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {error && (
            <AppText variant="error" className="mt-1">
              {error.message || 'Required field'}
            </AppText>
          )}
        </View>
      )}
    />
  );
};

export default AppRadio;
