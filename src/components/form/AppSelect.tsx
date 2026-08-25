import AppText from "@/src/components/common/AppText";
import { useTheme } from "@/src/hooks/useTheme";
import React, { useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

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
  zIndex?: number;
  zIndexInverse?: number;
}

export default function AppSelect({
  name,
  control,
  options,
  label,
  placeholder = "Select option",
  rules,
  icon,
  zIndex = 3000,
  zIndexInverse = 1000,
}: IAppSelectProps) {
  const { colors, isDark } = useTheme();
  const [open, setOpen] = useState(false);

  const surfaceBg = colors.surface;
  const chevronColor = colors.textSecondary;
  const borderColor = colors.surfaceBorder;
  const errorColor = colors.error;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectBorderColor = error ? errorColor : borderColor;

        return (
          <View className="mb-3 w-full" style={{ zIndex }}>
            {label && (
              <AppText weight="medium" variant="label" className="mb-1">
                {label}
              </AppText>
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <DropDownPicker
                open={open}
                value={value}
                items={options}
                setOpen={setOpen}
                setValue={(val) => {
                  const newValue = typeof val === "function" ? val(value) : val;
                  // Allow deselection if the same value is tapped
                  if (newValue === value) {
                    onChange("");
                  } else {
                    onChange(newValue);
                  }
                }}
                setItems={() => {}}
                placeholder={placeholder}
                theme={isDark ? "DARK" : "LIGHT"}
                listMode="SCROLLVIEW"
                zIndex={zIndex}
                zIndexInverse={zIndexInverse}
                style={{
                  backgroundColor: surfaceBg,
                  borderColor: selectBorderColor,
                  borderWidth: 1.5,
                  minHeight: 52,
                  borderRadius: 6,
                  paddingLeft: icon ? 40 : 12,
                }}
                dropDownContainerStyle={{
                  backgroundColor: surfaceBg,
                  borderColor: borderColor,
                  borderWidth: 1.5,
                }}
                textStyle={{
                  color: colors.text,
                }}
                placeholderStyle={{
                  color: colors.textMuted,
                }}
                arrowIconStyle={{
                  tintColor: chevronColor,
                } as any}
                tickIconStyle={{
                  tintColor: colors.primary,
                } as any}
                selectedItemContainerStyle={{
                  backgroundColor: colors.primary + "15", // Light tint of primary color
                }}
                selectedItemLabelStyle={{
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              />
              {icon && (
                <View
                  style={{
                    position: "absolute",
                    left: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: zIndex + 1,
                    pointerEvents: "none",
                  }}
                >
                  {icon}
                </View>
              )}
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
}
