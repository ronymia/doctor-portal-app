import Feather from '@expo/vector-icons/Feather';
import { router } from "expo-router";

import { FlatList, TouchableOpacity, View } from "react-native";

import AppCard from "@/src/components/common/AppCard";
import AppText from "@/src/components/common/AppText";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import { useTheme } from "@/src/hooks/useTheme";
import { useGetAppointmentsQuery } from "@/src/store/api";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logout } from "@/src/store/slices/authSlice";

export default function DoctorDashboard() {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();

  // THEME COLOR PALETTE
  const primaryColor = colors.primary;
  const primaryLight = colors.primaryLight;
  const accentColor = colors.accent;
  const successColor = colors.success;
  const textColor = colors.text;
  const borderColor = colors.surfaceBorder;

  const user = useAppSelector((state) => state.auth.user);

  // FETCH DOCTOR"S APPOINTMENTS
  const { data: appointmentsResponse, refetch } = useGetAppointmentsQuery({
    doctorId: user?.doctor?.id,
  });
  const appointments = appointmentsResponse?.data || [];

  // DERIVED STATS
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (a: any) => a.status === "COMPLETED",
  ).length;
  const scheduledAppointments = appointments.filter(
    (a: any) => a.status === "SCHEDULED",
  ).length;

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <ScreenWrapper
      scrollable
      onRefresh={refetch}
      refreshing={false}
      padding={16}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <AppText variant="bodySecondary">Clinical Workspace</AppText>
          <AppText weight="bold" variant="subtitle">
            {user?.profile?.fullName || "Doctor"}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="w-9 h-9 rounded-full justify-center items-center"
          style={{ backgroundColor: borderColor }}
        >
          <Feather name="log-out" size={16} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* STATS GRID */}
      <View className="flex-row justify-between gap-2 mb-5">
        <AppCard
          style={{ flex: 1, padding: 12, alignItems: "center" }}
          bordered={false}
        >
          <Feather name="clock" size={20} color={accentColor} />
          <AppText
            weight="bold"
            variant="subtitle"
            style={{ fontSize: 22, marginVertical: 4 }}
          >
            {scheduledAppointments}
          </AppText>
          <AppText variant="caption">Pending Slots</AppText>
        </AppCard>

        <AppCard
          style={{ flex: 1, padding: 12, alignItems: "center" }}
          bordered={false}
        >
          <Feather name="check-circle" size={20} color={successColor} />
          <AppText
            weight="bold"
            variant="subtitle"
            style={{ fontSize: 22, marginVertical: 4 }}
          >
            {completedAppointments}
          </AppText>
          <AppText variant="caption">Completed</AppText>
        </AppCard>

        <AppCard
          style={{ flex: 1, padding: 12, alignItems: "center" }}
          bordered={false}
        >
          <Feather name="calendar" size={20} color={primaryColor} />
          <AppText
            weight="bold"
            variant="subtitle"
            style={{ fontSize: 22, marginVertical: 4 }}
          >
            {totalAppointments}
          </AppText>
          <AppText variant="caption">Total Visits</AppText>
        </AppCard>
      </View>

      {/* TODAY'S CONSULTATIONS LIST */}
      <View className="mb-5">
        <AppText weight="bold" variant="body" className="mb-3">
          Today&apos;s Consultations
        </AppText>
        {appointments.length === 0 ? (
          <AppCard bordered>
            <AppText align="center" variant="bodySecondary">
              No appointments booked for today. You are free!
            </AppText>
          </AppCard>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }: any) => {
              // DERIVE PATIENT NAME AND TIME SLOT STRING
              const patientName =
                item.patient?.patient?.profile?.fullName || "Patient";
              const timeSlot = item.availableService?.slot;
              const timeString = timeSlot
                ? `${timeSlot.startTime} - ${timeSlot.endTime}`
                : "Time unscheduled";
              return (
                <AppCard style={{ marginBottom: 8 }}>
                  <View className="flex-row justify-between items-center mb-1">
                    <View className="flex-row items-center gap-1">
                      <Feather name="user" size={16} color={isDark ? "#94A3B8" : "#475569"} />
                      <AppText weight="semibold" style={{ fontSize: 14 }}>
                        {patientName}
                      </AppText>
                    </View>
                    <View
                      className="py-0.5 px-2 rounded-[4px]"
                      style={{ backgroundColor: primaryLight }}
                    >
                      <AppText
                        weight="bold"
                        variant="caption"
                        color={primaryColor}
                      >
                        {item.status}
                      </AppText>
                    </View>
                  </View>
                  <AppText variant="bodySecondary" style={{ fontSize: 13 }}>
                    Slot: {timeString}
                  </AppText>
                </AppCard>
              );
            }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
