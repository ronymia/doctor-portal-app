import { Clock } from "lucide-react-native";
import { useState } from "react";
import { TextInput, View } from "react-native";

import AppButton from "@/src/components/common/AppButton";
import AppCard from "@/src/components/common/AppCard";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import EmptyState from "@/src/components/common/EmptyState";
import { useTheme } from "@/src/hooks/useTheme";
import AdminScreenLayout from "@/src/screens/components/AdminScreenLayout";
import {
  useCreateTimeSlotMutation,
  useGetTimeSlotsQuery,
} from "@/src/store/api";

// ADMIN TIME SLOTS — FULLY SELF-CONTAINED SCREEN
export default function AdminTimeSlots() {
  const { colors, isDark } = useTheme();

  // THEME COLOR PALETTE
  const primaryColor = colors.primary;
  const mutedColor = colors.textMuted;
  const borderColor = colors.surfaceBorder;
  const textColor = colors.text;

  const { data: slotsResponse, isLoading, refetch } = useGetTimeSlotsQuery({});
  const allSlots = slotsResponse?.data || [];

  const [createTimeSlot, { isLoading: isCreating }] =
    useCreateTimeSlotMutation();

  // LOCAL FORM STATE FOR TIME SLOT CREATION
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");

  const handleCreate = async () => {
    if (!slotStart || !slotEnd) {
      alert("Please fill out start and end times (e.g. 10:00, 11:00).");
      return;
    }
    try {
      await createTimeSlot({ startTime: slotStart, endTime: slotEnd }).unwrap();
      alert("Time slot created successfully.");
      refetch();
      setSlotStart("");
      setSlotEnd("");
    } catch (err: any) {
      alert(
        err?.data?.message ||
          "Failed to create time slot. Overlaps are blocked.",
      );
    }
  };

  return (
    <AdminScreenLayout
      activeRoute="/admin/timeslots"
      title="Time Slots"
      onRefresh={refetch}
      refreshing={false}
    >
      {isLoading ? (
        <AppLoader />
      ) : (
        <View>
          {/* CREATE SLOT FORM */}
          <AppCard style={{ marginBottom: 20, padding: 14 }} bordered>
            <AppText weight="bold" className="mb-3">
              Define New Time Slot
            </AppText>

            <View className="flex-row justify-between gap-2 mb-3">
              <View className="flex-1">
                <AppText variant="caption" className="mb-1">
                  Start Time (24h e.g. 09:00)
                </AppText>
                <TextInput
                  value={slotStart}
                  onChangeText={setSlotStart}
                  placeholder="09:00"
                  placeholderTextColor={mutedColor}
                  style={{
                    height: 40,
                    borderColor,
                    borderWidth: 1,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    color: textColor,
                    backgroundColor: isDark ? "#151D30" : "#FFFFFF",
                  }}
                />
              </View>
              <View className="flex-1">
                <AppText variant="caption" className="mb-1">
                  End Time (24h e.g. 10:00)
                </AppText>
                <TextInput
                  value={slotEnd}
                  onChangeText={setSlotEnd}
                  placeholder="10:00"
                  placeholderTextColor={mutedColor}
                  style={{
                    height: 40,
                    borderColor,
                    borderWidth: 1,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    color: textColor,
                    backgroundColor: isDark ? "#151D30" : "#FFFFFF",
                  }}
                />
              </View>
            </View>

            <AppButton
              title="Create Time Slot"
              onPress={handleCreate}
              loading={isCreating}
              style={{ width: "100%", height: 38 }}
            />
          </AppCard>

          {/* CONFIGURED SLOTS LIST */}
          <AppText weight="bold" variant="body" className="mb-3">
            Configured Time Slots
          </AppText>
          {allSlots.length === 0 ? (
            <EmptyState message="No time slots created yet." />
          ) : (
            allSlots.map((slot: any) => (
              <AppCard style={{ marginBottom: 8, padding: 12 }} key={slot.id}>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <Clock size={16} color={primaryColor} />
                    <AppText weight="semibold">
                      {slot.startTime} - {slot.endTime}
                    </AppText>
                  </View>
                  <AppText variant="caption" color={mutedColor}>
                    Active
                  </AppText>
                </View>
              </AppCard>
            ))
          )}
        </View>
      )}
    </AdminScreenLayout>
  );
}
