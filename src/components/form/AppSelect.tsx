import AppText from "@/src/components/common/AppText";
import { useTheme } from "@/src/hooks/useTheme";
import { ChevronDown, X } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IOption {
  label: string;
  value: string | number;
}

interface IAppSelectProps {
  name: string;
  control: any;
  options: IOption[];
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  icon?: React.ReactNode;
}

export default function AppSelect({
  name,
  control,
  options,
  label,
  placeholder = "Select option",
  rules,
  icon,
}: IAppSelectProps) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const surfaceBg = colors.surface;
  const bgColor = colors.background;
  const chevronColor = colors.textSecondary;
  const closeIconColor = colors.text;
  const primaryLight = colors.primaryLight;
  const primaryColor = colors.primary;
  const borderColor = colors.surfaceBorder;
  const errorColor = colors.error;

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
              style={{
                backgroundColor: surfaceBg,
                borderColor: selectBorderColor,
              }}
            >
              <View className="flex-row items-center">
                {icon && (
                  <View className="mr-2 justify-center items-center">
                    {icon}
                  </View>
                )}
                <AppText
                  className={
                    !selectedOption
                      ? "text-brand-text-muted dark:text-dark-text-muted"
                      : ""
                  }
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </AppText>
              </View>
              <ChevronDown size={18} color={chevronColor} />
            </TouchableOpacity>

            {error && (
              <AppText variant="error" className="mt-1">
                {error.message || "Required field"}
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
                            backgroundColor: isSelected
                              ? primaryLight
                              : surfaceBg,
                            borderBottomColor: borderColor,
                          }}
                        >
                          <AppText
                            weight={isSelected ? "semibold" : "regular"}
                            color={isSelected ? primaryColor : undefined}
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
}
