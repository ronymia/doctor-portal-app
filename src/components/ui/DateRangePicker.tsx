
import Feather from '@expo/vector-icons/Feather';
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

export default function DateRangePicker() {
  const [isPickerOpen, setIsPickerOpen] = useState(true); // default open to show the design

  // Colors from the design
  const colors = {
    bgApp: "#1A1C29",
    bgPicker: "#26293C",
    bgInput: "#1D2033",
    bgButtonDark: "#1D2033",
    primaryTeal: "#00BFA5",
    primaryTealDark: "#105051", // For range selection background
    textMuted: "#6B7280",
    textLight: "#9CA3AF",
    textWhite: "#FFFFFF",
  };

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  // Generating a static grid for March 2018 to match exactly with the image
  // Feb 2018 ended on a Wednesday (28 days). March 1 is Thursday.
  const calendarDays = [
    { day: 25, prevMonth: true },
    { day: 26, prevMonth: true },
    { day: 27, prevMonth: true },
    { day: 28, prevMonth: true },
    { day: 1, currentMonth: true },
    { day: 2, currentMonth: true, inRange: true, isStart: true },
    { day: 3, currentMonth: true, inRange: true },
    { day: 4, currentMonth: true, inRange: true },
    { day: 5, currentMonth: true, inRange: true },
    { day: 6, currentMonth: true, inRange: true },
    { day: 7, currentMonth: true, inRange: true },
    { day: 8, currentMonth: true, inRange: true },
    { day: 9, currentMonth: true, inRange: true, isEnd: true },
    { day: 10, currentMonth: true },
    { day: 11, currentMonth: true },
    { day: 12, currentMonth: true },
    { day: 13, currentMonth: true },
    { day: 14, currentMonth: true },
    { day: 15, currentMonth: true },
    { day: 16, currentMonth: true, bold: true },
    { day: 17, currentMonth: true },
    { day: 18, currentMonth: true },
    { day: 19, currentMonth: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true, bold: true },
    { day: 24, currentMonth: true },
    { day: 25, currentMonth: true },
    { day: 26, currentMonth: true },
    { day: 27, currentMonth: true },
    { day: 28, currentMonth: true },
    { day: 29, currentMonth: true },
    { day: 30, currentMonth: true, bold: true },
    { day: 31, currentMonth: true },
  ];

  return (
    <View style={[{ backgroundColor: colors.bgApp, flex: 1, padding: 20 }]}>
      {/* Top Input Bar */}
      <View style={{ alignItems: "flex-end", marginBottom: 20, zIndex: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primaryTeal,
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 4,
          }}
          onPress={() => setIsPickerOpen(!isPickerOpen)}
        >
          <Text
            style={{ color: colors.textWhite, marginRight: 12, fontSize: 14 }}
          >
            08-12-2016 | 10-22-2018
          </Text>
          <Feather name="calendar" color={colors.textWhite} size={18} />
        </TouchableOpacity>
      </View>

      {/* Popover Date Picker */}
      {isPickerOpen && (
        <View
          style={{
            backgroundColor: colors.bgPicker,
            borderRadius: 8,
            padding: 24,
            flexDirection: Platform.OS === "web" ? "row" : "column", // Responsive row on web
            elevation: 10,
            alignSelf: "center",
            width: "100%",
            maxWidth: 720,
          }}
        >
          {/* Left Side: Calendar */}
          <View
            style={{
              flex: 1.2,
              paddingRight: Platform.OS === "web" ? 32 : 0,
              marginBottom: Platform.OS === "web" ? 0 : 32,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: colors.textWhite,
                  fontSize: 16,
                  fontWeight: "bold",
                  marginRight: 16,
                }}
              >
                March 2018
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity>
                  <Feather name="chevron-left" color={colors.primaryTeal} size={20} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="chevron-right" color={colors.primaryTeal} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Days of week */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              {daysOfWeek.map((day, i) => (
                <Text
                  key={i}
                  style={{
                    color: colors.textLight,
                    width: 32,
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 0,
                justifyContent: "space-between",
              }}
            >
              {calendarDays.map((item, index) => {
                const isSelectedNode = item.isStart || item.isEnd;
                return (
                  <View
                    key={index}
                    style={{
                      width: 32,
                      height: 32,
                      marginBottom: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        item.inRange && !isSelectedNode
                          ? colors.primaryTealDark
                          : "transparent",
                      borderRadius: isSelectedNode ? 16 : 0,
                      ...(item.inRange &&
                        !isSelectedNode && { width: "14.28%" }),
                      ...(item.isStart && {
                        backgroundColor: colors.primaryTeal,
                      }),
                      ...(item.isEnd && {
                        backgroundColor: colors.primaryTeal,
                      }),
                    }}
                  >
                    <Text
                      style={{
                        color: item.prevMonth
                          ? "#4B5563"
                          : item.bold || isSelectedNode
                            ? colors.textWhite
                            : colors.textLight,
                        fontWeight:
                          item.bold || isSelectedNode ? "bold" : "normal",
                        fontSize: 13,
                      }}
                    >
                      {item.day}
                    </Text>
                  </View>
                );
              })}
            </View>

            <Text
              style={{
                color: "#4B5563",
                fontSize: 10,
                marginTop: 16,
                lineHeight: 16,
                fontWeight: "600",
              }}
            >
              WE ARE USING WEEKLY DATA BASED ON NAV DATES AS THE FUND IS WEEKLY
            </Text>
          </View>

          {/* Right Side: Inputs and Buttons */}
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            {/* Start / End Date Inputs */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text
                  style={{
                    color: colors.textLight,
                    fontSize: 12,
                    marginBottom: 8,
                  }}
                >
                  Start Date
                </Text>
                <View
                  style={{
                    backgroundColor: colors.bgInput,
                    padding: 12,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: colors.textWhite, fontSize: 14 }}>
                    03-06-2018
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text
                  style={{
                    color: colors.textLight,
                    fontSize: 12,
                    marginBottom: 8,
                  }}
                >
                  End Date
                </Text>
                <View
                  style={{
                    backgroundColor: colors.bgInput,
                    padding: 12,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: colors.textWhite, fontSize: 14 }}>
                    03-09-2018
                  </Text>
                </View>
              </View>
            </View>

            {/* Inception Button */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.bgButtonDark,
                padding: 12,
                borderRadius: 4,
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text style={{ color: colors.primaryTeal, fontSize: 13 }}>
                Inception
              </Text>
            </TouchableOpacity>

            {/* Preset Buttons Grid */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginHorizontal: -4,
                marginBottom: 16,
              }}
            >
              {["YTD", "QTD", "MTD", "WTD", "1Y", "1Q", "1M", "1W"].map(
                (label, idx) => (
                  <View
                    key={idx}
                    style={{
                      width: "25%",
                      paddingHorizontal: 4,
                      marginBottom: 8,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.bgButtonDark,
                        paddingVertical: 10,
                        alignItems: "center",
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primaryTeal,
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ),
              )}
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.primaryTeal,
                padding: 16,
                borderRadius: 4,
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              <Text
                style={{
                  color: colors.textWhite,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                Apply Dates
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
