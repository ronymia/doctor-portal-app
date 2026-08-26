import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import PremiumSelectionModal from "./PremiumSelectionModal";

export interface IAppSelectionModalProps {
  name: string;
  control: any;
  options?: any[];
  data?: any[];
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  modalTitle?: string;
  labelField?: string;
  valueField?: string;
  rules?: RegisterOptions;
  icon?: React.ReactNode;
  singleSelect?: boolean;
}

export default function AppSelectionModal({
  name,
  control,
  options,
  data,
  label,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  modalTitle = "Select Option",
  labelField,
  valueField,
  rules,
  icon,
  singleSelect = true,
}: IAppSelectionModalProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const items = data || options || [];
  // Detect default label/value fields if not explicitly passed
  const resolvedLabelField =
    labelField ||
    (items.length > 0 && "name" in items[0] ? "name" : "label");
  const resolvedValueField =
    valueField ||
    (items.length > 0 && "id" in items[0] ? "id" : "value");

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const hasValue = singleSelect
          ? value !== undefined && value !== null && value !== ""
          : Array.isArray(value) && value.length > 0;

        const getDisplayText = () => {
          if (!hasValue) return "";
          if (singleSelect) {
            const selectedItem = items.find((item: any) => {
              const itemVal = item[resolvedValueField];
              const currentVal =
                typeof value === "object" && value !== null
                  ? value[resolvedValueField]
                  : value;
              return String(itemVal) === String(currentVal);
            });
            return selectedItem ? selectedItem[resolvedLabelField] : String(value);
          } else {
            return (value || [])
              .map((val: any) => {
                const currentVal =
                  typeof val === "object" && val !== null
                    ? val[resolvedValueField]
                    : val;
                const selectedItem = items.find(
                  (item: any) =>
                    String(item[resolvedValueField]) === String(currentVal)
                );
                return selectedItem
                  ? selectedItem[resolvedLabelField]
                  : String(val);
              })
              .join(", ");
          }
        };

        const displayText = getDisplayText();

        const handleSelect = (selected: any) => {
          if (singleSelect) {
            const val =
              typeof selected === "object" && selected !== null && resolvedValueField in selected
                ? selected[resolvedValueField]
                : selected;
            onChange(val);
          } else {
            const newValues = (selected || []).map((item: any) =>
              typeof item === "object" && item !== null && resolvedValueField in item
                ? item[resolvedValueField]
                : item
            );
            onChange(newValues);
          }
        };

        return (
          <View className="mb-3 w-full">
            {label && (
              <Text className="mb-1 text-slate-700 font-medium" style={{ fontSize: 14 }}>
                {label}
              </Text>
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setModalVisible(true)}
              className={`bg-slate-50 border rounded-2xl flex-row items-center justify-between px-4 py-4 ${
                error ? "border-red-500" : "border-slate-200"
              }`}
            >
              <View className="flex-row items-center flex-1">
                {icon && <View className="mr-2">{icon}</View>}
                <Text
                  className={`ml-2 font-semibold ${
                    hasValue ? "text-slate-900" : "text-slate-400"
                  }`}
                  style={{ fontSize: 14 }}
                  numberOfLines={1}
                >
                  {displayText || placeholder}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#94a3b8" />
            </TouchableOpacity>

            {error && (
              <Text className="text-red-500 mt-1 text-xs">
                {error.message || "Required field"}
              </Text>
            )}

            <PremiumSelectionModal
              isVisible={modalVisible}
              onClose={() => setModalVisible(false)}
              title={modalTitle}
              data={items}
              labelField={resolvedLabelField}
              valueField={resolvedValueField}
              selectedValue={value}
              onSelect={handleSelect}
              placeholder={searchPlaceholder}
              singleSelect={singleSelect}
            />
          </View>
        );
      }}
    />
  );
}
