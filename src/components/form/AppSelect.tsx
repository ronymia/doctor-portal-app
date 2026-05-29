import React, { useState } from 'react';
import { View, TouchableOpacity, useColorScheme, FlatList, Modal, SafeAreaView } from 'react-native';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import { ChevronDown, X } from 'lucide-react-native';
import AppText from '../common/AppText';

interface Option {
  label: string;
  value: string | number;
}

interface AppSelectProps {
  name: string;
  control: any;
  options: Option[];
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  icon?: React.ReactNode;
}

export const AppSelect: React.FC<AppSelectProps> = ({
  name,
  control,
  options,
  label,
  placeholder = 'Select option',
  rules,
  icon,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);

  const surfaceBg = isDark ? '#151D30' : '#FFFFFF';
  const bgColor = isDark ? '#0B0F19' : '#F8FAFC';
  const chevronColor = isDark ? '#94A3B8' : '#475569';
  const closeIconColor = isDark ? '#F8FAFC' : '#0F172A';
  const primaryLight = isDark ? '#115E59' : '#CCFBF1';
  const primaryColor = isDark ? '#14B8A6' : '#0F766E';
  const borderColor = isDark ? '#222F4C' : '#E2E8F0';
  const errorColor = isDark ? '#F87171' : '#EF4444';

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = options.find((opt) => opt.value === value);
        const selectBorderColor = error ? errorColor : borderColor;

        return (
          <View className="mb-3 w-full">
            {label && (
              <AppText weight="medium" variant="label" className="mb-1">
                {label}
              </AppText>
            )}

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="h-[52px] border-[1.5px] rounded-md flex-row items-center justify-between px-3"
              style={{ backgroundColor: surfaceBg, borderColor: selectBorderColor }}
            >
              <View className="flex-row items-center">
                {icon && <View className="mr-2 justify-center items-center">{icon}</View>}
                <AppText color={selectedOption ? (isDark ? '#F8FAFC' : '#0F172A') : (isDark ? '#64748B' : '#94A3B8')}>
                  {selectedOption ? selectedOption.label : placeholder}
                </AppText>
              </View>
              <ChevronDown size={18} color={chevronColor} />
            </TouchableOpacity>

            {error && (
              <AppText variant="error" className="mt-1">
                {error.message || 'Required field'}
              </AppText>
            )}

            {/* List Picker Modal */}
            <Modal
              visible={modalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View className="flex-1 justify-end bg-black/50">
                <SafeAreaView
                  className="rounded-t-[20px] max-h-[60%] min-h-[30%] overflow-hidden"
                  style={{ backgroundColor: bgColor }}
                >
                  <View
                    className="flex-row items-center justify-between p-4 border-b"
                    style={{ borderBottomColor: borderColor }}
                  >
                    <AppText weight="bold" variant="subtitle">
                      {label || placeholder}
                    </AppText>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      className="p-1"
                    >
                      <X size={20} color={closeIconColor} />
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={options}
                    keyExtractor={(item) => item.value.toString()}
                    contentContainerStyle={{ paddingVertical: 8 }}
                    renderItem={({ item }) => {
                      const isSelected = item.value === value;
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            onChange(item.value);
                            setModalVisible(false);
                          }}
                          className="py-4 px-5 border-b"
                          style={{
                            backgroundColor: isSelected ? primaryLight : surfaceBg,
                            borderBottomColor: borderColor,
                          }}
                        >
                          <AppText
                            weight={isSelected ? 'semibold' : 'regular'}
                            color={isSelected ? primaryColor : (isDark ? '#F8FAFC' : '#0F172A')}
                          >
                            {item.label}
                          </AppText>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </SafeAreaView>
              </View>
            </Modal>
          </View>
        );
      }}
    />
  );
};

export default AppSelect;
