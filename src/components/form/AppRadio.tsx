import { useEffect, useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import {
  Animated,
  Pressable,
  View,
} from "react-native";
import AppText from "@/src/components/common/AppText";
import { useTheme } from "@/src/hooks/useTheme";

interface IRadioOption {
  label: string;
  value: string | number;
}

interface IAppRadioProps {
  name: string;
  control: any;
  options: IRadioOption[];
  label?: string;
  rules?: RegisterOptions;
  horizontal?: boolean;
}

function RadioChip({
  option,
  isSelected,
  hasError,
  onPress,
}: {
  option: IRadioOption;
  isSelected: boolean;
  hasError: boolean;
  onPress: () => void;
}) {
  const { colors, isDark } = useTheme();

  const primaryColor = colors.primary;
  const primaryBg = isDark ? "rgba(20,184,166,0.15)" : "rgba(15,118,110,0.08)";
  const errorColor = colors.error;
  const errorBg = isDark ? "rgba(248,113,113,0.12)" : "rgba(239,68,68,0.06)";
  const unselectedBorder = isDark ? "#334155" : "#CBD5E1";
  const unselectedBg = isDark ? "#1E293B" : "#F8FAFC";

  const [scaleAnim] = useState(() => new Animated.Value(1));
  const [dotScale] = useState(() => new Animated.Value(isSelected ? 1 : 0));

  useEffect(() => {
    Animated.spring(dotScale, {
      toValue: isSelected ? 1 : 0,
      useNativeDriver: false,
      speed: 20,
      bounciness: isSelected ? 12 : 0,
    }).start();
  }, [isSelected, dotScale]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: false,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: false,
      speed: 50,
      bounciness: 6,
    }).start();
  };

  const borderColor = hasError
    ? errorColor
    : isSelected
      ? primaryColor
      : unselectedBorder;
  const bgColor = hasError
    ? errorBg
    : isSelected
      ? primaryBg
      : unselectedBg;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor,
          backgroundColor: bgColor,
          gap: 10,
        }}
      >
        {/* RADIO DOT */}
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: primaryColor,
              transform: [{ scale: dotScale }],
              opacity: dotScale,
            }}
          />
        </View>

        {/* LABEL */}
        <AppText
          weight={isSelected ? "semibold" : "regular"}
          color={isSelected ? primaryColor : undefined}
          style={{ fontSize: 14 }}
        >
          {option.label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

export default function AppRadio({
  name,
  control,
  options,
  label,
  rules,
  horizontal = false,
}: IAppRadioProps) {
  const { colors } = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="mb-3 w-full">
          {label && (
            <AppText weight="medium" variant="label" className="mb-2">
              {label}
            </AppText>
          )}

          <View
            style={{
              flexDirection: horizontal ? "row" : "column",
              flexWrap: horizontal ? "wrap" : undefined,
              gap: 10,
            }}
          >
            {options.map((option) => (
              <RadioChip
                key={option.value.toString()}
                option={option}
                isSelected={option.value === value}
                hasError={!!error}
                onPress={() => onChange(option.value)}
              />
            ))}
          </View>

          {error && (
            <AppText variant="error" color={colors.error} className="mt-1.5">
              {error.message || "Required field"}
            </AppText>
          )}
        </View>
      )}
    />
  );
}
