import React, { useState } from 'react';
import { View, TouchableOpacity, useColorScheme, Modal, SafeAreaView } from 'react-native';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import { Calendar, X } from 'lucide-react-native';
import AppText from '../common/AppText';
import AppSelect from './AppSelect';

interface AppDateInputProps {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
}

export const AppDateInput: React.FC<AppDateInputProps> = ({
  name,
  control,
  label,
  placeholder = 'Select Date (YYYY-MM-DD)',
  rules,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);

  const surfaceBg = isDark ? '#151D30' : '#FFFFFF';
  const bgColor = isDark ? '#0B0F19' : '#F8FAFC';
  const borderColor = isDark ? '#222F4C' : '#E2E8F0';
  const errorColor = isDark ? '#F87171' : '#EF4444';
  const calendarIconColor = isDark ? '#64748B' : '#94A3B8';
  const closeIconColor = isDark ? '#F8FAFC' : '#0F172A';
  const primaryColor = isDark ? '#14B8A6' : '#0F766E';

  // Generate Year/Month/Day options
  const years = Array.from({ length: 80 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { label: y.toString(), value: y.toString() };
  });

  const months = Array.from({ length: 12 }, (_, i) => {
    const m = (i + 1).toString().padStart(2, '0');
    return { label: m, value: m };
  });

  const days = Array.from({ length: 31 }, (_, i) => {
    const d = (i + 1).toString().padStart(2, '0');
    return { label: d, value: d };
  });

  const [selectedYear, setSelectedYear] = useState('2000');
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedDay, setSelectedDay] = useState('01');

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const formattedDate = value ? new Date(value).toISOString().split('T')[0] : '';
        const inputBorderColor = error ? errorColor : borderColor;

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
              style={{ backgroundColor: surfaceBg, borderColor: inputBorderColor }}
            >
              <View className="flex-row items-center">
                <View className="mr-2 justify-center items-center">
                  <Calendar size={18} color={calendarIconColor} />
                </View>
                <AppText
                  color={formattedDate ? (isDark ? '#F8FAFC' : '#0F172A') : (isDark ? '#64748B' : '#94A3B8')}
                >
                  {formattedDate || placeholder}
                </AppText>
              </View>
            </TouchableOpacity>

            {error && (
              <AppText variant="error" className="mt-1">
                {error.message || 'Required field'}
              </AppText>
            )}

            {/* Date Picker Modal */}
            <Modal
              visible={modalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <View className="flex-1 justify-center px-5 bg-black/50">
                <SafeAreaView
                  className="rounded-2xl overflow-hidden pb-4"
                  style={{ backgroundColor: surfaceBg }}
                >
                  <View
                    className="flex-row items-center justify-between p-4 border-b"
                    style={{ borderBottomColor: borderColor }}
                  >
                    <AppText weight="bold" variant="subtitle">
                      {label || 'Select Date'}
                    </AppText>
                    <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1">
                      <X size={20} color={closeIconColor} />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row p-3 gap-2">
                    <View className="flex-1">
                      <AppText weight="semibold" variant="bodySecondary" align="center" className="mb-1">
                        Year
                      </AppText>
                      <AppSelect
                        name="year"
                        control={control}
                        placeholder={selectedYear}
                        options={years}
                        rules={{ required: false }}
                      />
                    </View>
                    <View className="flex-1">
                      <AppText weight="semibold" variant="bodySecondary" align="center" className="mb-1">
                        Month
                      </AppText>
                      <AppSelect
                        name="month"
                        control={control}
                        placeholder={selectedMonth}
                        options={months}
                        rules={{ required: false }}
                      />
                    </View>
                    <View className="flex-1">
                      <AppText weight="semibold" variant="bodySecondary" align="center" className="mb-1">
                        Day
                      </AppText>
                      <AppSelect
                        name="day"
                        control={control}
                        placeholder={selectedDay}
                        options={days}
                        rules={{ required: false }}
                      />
                    </View>
                  </View>

                  <View className="px-4 pt-2">
                    <TouchableOpacity
                      onPress={() => {
                        const formValues = control._formValues;
                        const y = formValues.year || selectedYear;
                        const m = formValues.month || selectedMonth;
                        const d = formValues.day || selectedDay;
                        const dateStr = `${y}-${m}-${d}`;
                        onChange(new Date(dateStr).toISOString());
                        setModalVisible(false);
                      }}
                      className="h-12 rounded-md justify-center items-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <AppText weight="semibold" color="#FFFFFF">
                        Confirm
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </View>
            </Modal>
          </View>
        );
      }}
    />
  );
};

export default AppDateInput;
