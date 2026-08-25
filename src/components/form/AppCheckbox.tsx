import Feather from '@expo/vector-icons/Feather';
import AppText from "@/src/components/common/AppText";
import { useTheme } from "@/src/hooks/useTheme";

import { Controller, RegisterOptions } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

interface IAppCheckboxProps {
  name: string;
  control: any;
  label: string;
  rules?: RegisterOptions;
}

export default function AppCheckbox({
  name,
  control,
  label,
  rules,
}: IAppCheckboxProps) {
  const { colors } = useTheme();
  const primaryColor = colors.primary;
  const errorColor = colors.error;

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
                backgroundColor: value ? primaryColor : "transparent",
              }}
            >
              {value && <Feather name="check" size={14} color="#FFFFFF" />}
            </View>
            <AppText variant="body" className="flex-1">
              {label}
            </AppText>
          </TouchableOpacity>
          {error && (
            <AppText variant="error" className="mt-1 ml-[30px]">
              {error.message || "Required field"}
            </AppText>
          )}
        </View>
      )}
    />
  );
}
