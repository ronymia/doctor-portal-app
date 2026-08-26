import Feather from "@expo/vector-icons/Feather";
import { View } from "react-native";

import AppCard from "@/src/components/common/AppCard";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import EmptyState from "@/src/components/common/EmptyState";
import { useTheme } from "@/src/hooks/useTheme";
import AdminScreenLayout from "@/src/layouts/AdminScreenLayout";
import useGetTimeSlotsQuery from "../hooks/queries/useGetTimeSlotsQuery";

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
                    <Feather name="clock" size={16} color={primaryColor} />
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
