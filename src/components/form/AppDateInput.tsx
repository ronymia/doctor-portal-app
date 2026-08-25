import Feather from '@expo/vector-icons/Feather';
import AppText from "@/src/components/common/AppText";
import { useTheme } from "@/src/hooks/useTheme";

import { useState } from "react";
import { Controller, RegisterOptions } from "react-hook-form";
import { Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IAppDateInputProps {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
}

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => {
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Mon = 0, Sun = 6
};

const parseLocalDate = (dateStr: string | undefined | null): Date => {
  if (!dateStr) return new Date();
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 0-based month
    const day = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
};

const getFormattedDateStr = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") {
    return val.split("T")[0];
  }
  if (val instanceof Date) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}`;
  }
  return "";
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AppDateInput({
  name,
  control,
  label,
  placeholder = "Select Date (YYYY-MM-DD)",
  rules,
}: IAppDateInputProps) {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const surfaceBg = colors.surface;
  const borderColor = colors.surfaceBorder;
  const errorColor = colors.error;
  const calendarIconColor = colors.textMuted;
  const primaryColor = colors.primary || "#0F766E";

  // Internal state for calendar navigation
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(
    null,
  );

  const handleOpenModal = (currentValue: string | undefined) => {
    const d = currentValue ? parseLocalDate(currentValue) : new Date();
    setInternalSelectedDate(currentValue ? d : null);
    setCurrentMonthDate(d);
    setModalVisible(true);
  };

  const changeMonth = (delta: number) => {
    setCurrentMonthDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const formattedDate = getFormattedDateStr(value);
        const inputBorderColor = error ? errorColor : borderColor;

        return (
          <View className="mb-3 w-full">
            {label && (
              <AppText weight="medium" variant="label" className="mb-1">
                {label}
              </AppText>
            )}

            <TouchableOpacity
              onPress={() => handleOpenModal(value)}
              className="h-[52px] border-[1.5px] rounded-md flex-row items-center justify-between px-3"
              style={{
                backgroundColor: surfaceBg,
                borderColor: inputBorderColor,
              }}
            >
              <View className="flex-row items-center">
                <View className="mr-2 justify-center items-center">
                  <Feather name="calendar" size={18} color={calendarIconColor} />
                </View>
                <AppText
                  className={
                    !formattedDate
                      ? "text-brand-text-muted dark:text-dark-text-muted"
                      : ""
                  }
                >
                  {formattedDate || placeholder}
                </AppText>
              </View>
            </TouchableOpacity>

            {error && (
              <AppText variant="error" className="mt-1">
                {error.message || "Required field"}
              </AppText>
            )}

            {/* Date Picker Modal */}
            <Modal
              visible={modalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View className="flex-1 justify-end bg-black/50">
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setModalVisible(false)}
                />
                <SafeAreaView
                  edges={["bottom"]}
                  className="rounded-t-3xl overflow-hidden pt-6 pb-8"
                  style={{ backgroundColor: surfaceBg }}
                >
                  {/* Calendar Header */}
                  <View className="flex-row items-center justify-between px-6 mb-6 pt-5">
                    <TouchableOpacity
                      onPress={() => changeMonth(-1)}
                      className="w-10 h-10 rounded-full items-center justify-center border"
                      style={{ borderColor: borderColor }}
                    >
                      <Feather name="chevron-left" size={20} color={colors.text} />
                    </TouchableOpacity>

                    <AppText weight="bold" style={{ fontSize: 18 }}>
                      {MONTH_NAMES[currentMonthDate.getMonth()]}{" "}
                      {currentMonthDate.getFullYear()}
                    </AppText>

                    <TouchableOpacity
                      onPress={() => changeMonth(1)}
                      className="w-10 h-10 rounded-full items-center justify-center border"
                      style={{ borderColor: borderColor }}
                    >
                      <Feather name="chevron-right" size={20} color={colors.text} />
                    </TouchableOpacity>
                  </View>

                  {/* Weekdays */}
                  <View className="flex-row justify-between px-6 mb-4">
                    {WEEK_DAYS.map((day) => (
                      <AppText
                        key={day}
                        style={{
                          width: 36,
                          textAlign: "center",
                          color: colors.textSecondary,
                          fontSize: 13,
                        }}
                      >
                        {day}
                      </AppText>
                    ))}
                  </View>

                  {/* Calendar Grid */}
                  <View className="flex-row flex-wrap px-6 mb-6">
                    {/* Empty slots for first day */}
                    {Array.from({
                      length: getFirstDayOfMonth(
                        currentMonthDate.getFullYear(),
                        currentMonthDate.getMonth(),
                      ),
                    }).map((_, i) => (
                      <View
                        key={`empty-${i}`}
                        style={{ width: "14.28%", height: 44 }}
                      />
                    ))}

                    {/* Days */}
                    {Array.from({
                      length: getDaysInMonth(
                        currentMonthDate.getFullYear(),
                        currentMonthDate.getMonth(),
                      ),
                    }).map((_, i) => {
                      const dayNum = i + 1;
                      const isSelected =
                        internalSelectedDate?.getDate() === dayNum &&
                        internalSelectedDate?.getMonth() ===
                          currentMonthDate.getMonth() &&
                        internalSelectedDate?.getFullYear() ===
                          currentMonthDate.getFullYear();

                      const today = new Date();
                      const isToday =
                        today.getDate() === dayNum &&
                        today.getMonth() === currentMonthDate.getMonth() &&
                        today.getFullYear() === currentMonthDate.getFullYear();

                      return (
                        <TouchableOpacity
                          key={dayNum}
                          onPress={() =>
                            setInternalSelectedDate(
                              new Date(
                                currentMonthDate.getFullYear(),
                                currentMonthDate.getMonth(),
                                dayNum,
                              ),
                            )
                          }
                          style={{
                            width: "14.28%",
                            height: 44,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              alignItems: "center",
                              justifyContent: "center",
                              borderWidth: isToday && !isSelected ? 1.5 : 0,
                              borderColor: isToday && !isSelected ? primaryColor : "transparent",
                              backgroundColor: isSelected ? primaryColor : "transparent",
                            }}
                          >
                            <AppText
                              style={{
                                color: isSelected
                                  ? "#FFFFFF"
                                  : isToday
                                  ? primaryColor
                                  : colors.text,
                                fontWeight:
                                  isSelected || isToday ? "bold" : "normal",
                                fontSize: 15,
                              }}
                            >
                              {dayNum}
                            </AppText>
                            {isToday && !isSelected && (
                              <View
                                style={{
                                  position: "absolute",
                                  bottom: 4,
                                  width: 4,
                                  height: 4,
                                  borderRadius: 2,
                                  backgroundColor: primaryColor,
                                }}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Done Button */}
                  <View className="px-6">
                    <TouchableOpacity
                      onPress={() => {
                        if (internalSelectedDate) {
                          const dateStr = getFormattedDateStr(internalSelectedDate);
                          onChange(new Date(dateStr).toISOString());
                        }
                        setModalVisible(false);
                      }}
                      className="h-14 rounded-2xl justify-center items-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <AppText
                        weight="bold"
                        style={{ color: "#FFFFFF", fontSize: 16 }}
                      >
                        Done
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
}
