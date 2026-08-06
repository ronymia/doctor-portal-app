import { Award, Calendar, Clock, ShieldAlert, User } from "lucide-react-native";
import { FlatList, View } from "react-native";

import AppButton from "@/src/components/common/AppButton";
import AppCard from "@/src/components/common/AppCard";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import { useTheme } from "@/src/hooks/useTheme";
import {
  useCancelAppointmentMutation,
  useFinishAppointmentMutation,
  useGetAppointmentsQuery,
  useStartAppointmentMutation,
} from "@/src/store/api";
import { useAppSelector } from "@/src/store/hooks";

export default function AppointmentsScreen() {
  const { colors } = useTheme();

  const primaryColor = colors.primary;
  const primaryLight = colors.primaryLight;
  const successColor = colors.success;
  const warningColor = colors.warning;
  const errorColor = colors.error;
  const mutedColor = colors.textMuted;
  const secondaryColor = colors.textSecondary;
  const borderColor = colors.surfaceBorder;

  const user = useAppSelector((state) => state.auth.user);
  const isDoctor = user?.role === "DOCTOR";
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const queryParams = isAdmin
    ? {} // Admins fetch all appointments in the system
    : isDoctor
      ? { doctorId: user?.doctor?.id }
      : { patientId: user?.patient?.id };

  const {
    data: appointmentsResponse,
    isLoading,
    refetch,
    isFetching,
  } = useGetAppointmentsQuery(queryParams);
  const [cancelAppointment, { isLoading: isCancelling }] =
    useCancelAppointmentMutation();
  const [startAppointment, { isLoading: isStarting }] =
    useStartAppointmentMutation();
  const [finishAppointment, { isLoading: isFinishing }] =
    useFinishAppointmentMutation();

  const appointments = appointmentsResponse?.data || [];

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id).unwrap();
      alert("Appointment cancelled successfully.");
    } catch (err) {
      alert("Failed to cancel appointment.");
    }
  };
  const handleStart = async (id: string) => {
    try {
      await startAppointment(id).unwrap();
      alert("Consultation initiated! Payment record marked as PAID.");
    } catch (err) {
      alert("Failed to start consultation.");
    }
  };
  const handleFinish = async (id: string) => {
    try {
      await finishAppointment(id).unwrap();
      alert("Consultation completed successfully!");
    } catch (err) {
      alert("Failed to finish consultation.");
    }
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return { bg: primaryLight, text: primaryColor };
      case "COMPLETED":
        return { bg: successColor + "15", text: successColor };
      case "CANCELLED":
        return { bg: errorColor + "15", text: errorColor };
      case "PENDING_PAYMENT":
        return { bg: warningColor + "15", text: warningColor };
      default:
        return { bg: borderColor, text: secondaryColor };
    }
  };

  if (isLoading) {
    return <AppLoader message="Retrieving your scheduled visits..." />;
  }

  return (
    <ScreenWrapper scrollable={false} useSafeArea padding={16}>
      <View className="mb-5">
        <AppText weight="bold" variant="title">
          {isAdmin ? "System Appointments" : "My Consultations"}
        </AppText>
        <AppText variant="bodySecondary">
          {isAdmin
            ? "Review and manage all clinical appointments across the system"
            : "Review visit schedules and medical appointments status"}
        </AppText>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading || isFetching}
        ListEmptyComponent={
          <AppCard
            style={{
              padding: 28,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
            bordered
          >
            <ShieldAlert size={36} color={mutedColor} />
            <AppText
              align="center"
              variant="body"
              weight="medium"
              className="my-2"
            >
              No scheduled consultations found.
            </AppText>
            <AppText align="center" variant="caption">
              {isAdmin
                ? "No appointments are currently booked in the system."
                : "Book a doctor slot or refresh the list using pull-down gesture."}
            </AppText>
          </AppCard>
        }
        renderItem={({ item }: any) => {
          const serviceName =
            item.availableService?.service?.name || "General Consultation";
          const fees = item.availableService?.fees || 0;
          const slot = item.availableService?.slot;

          const patientName =
            item.patient?.patient?.profile?.fullName || "Patient";
          const doctorName =
            item.availableService?.availableDoctor?.doctor?.doctor?.profile
              ?.fullName || "Consultant";
          const targetName = isAdmin
            ? `Dr. ${doctorName} ➜ ${patientName}`
            : isDoctor
              ? patientName
              : `Dr. ${doctorName}`;

          const statusColors = getStatusColors(item.status);

          return (
            <AppCard style={{ marginBottom: 12 }}>
              {/* Card Header */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2 flex-1">
                  <View
                    className="w-9 h-9 rounded-full justify-center items-center"
                    style={{ backgroundColor: primaryLight }}
                  >
                    <User size={16} color={primaryColor} />
                  </View>
                  <View className="flex-1">
                    <AppText
                      weight="bold"
                      style={{ fontSize: 13 }}
                      numberOfLines={1}
                    >
                      {targetName}
                    </AppText>
                    <AppText variant="caption">
                      {isAdmin
                        ? "System Booking"
                        : isDoctor
                          ? "Patient Profile"
                          : "Medical Consultant"}
                    </AppText>
                  </View>
                </View>
                <View
                  className="py-1 px-2 rounded-[4px]"
                  style={{ backgroundColor: statusColors.bg }}
                >
                  <AppText
                    weight="bold"
                    variant="caption"
                    color={statusColors.text}
                  >
                    {item.status}
                  </AppText>
                </View>
              </View>

              <View
                className="h-px my-2"
                style={{ backgroundColor: borderColor }}
              />

              <AppText
                weight="semibold"
                style={{ fontSize: 15, marginBottom: 4 }}
              >
                {serviceName}
              </AppText>

              <View className="gap-1 mb-3">
                <View className="flex-row items-center gap-1">
                  <Calendar size={14} color={mutedColor} />
                  <AppText variant="caption">
                    Date: {new Date(item.appointmentDate).toLocaleDateString()}
                  </AppText>
                </View>
                {slot && (
                  <View className="flex-row items-center gap-1">
                    <Clock size={14} color={mutedColor} />
                    <AppText variant="caption">
                      Time: {slot.startTime} - {slot.endTime}
                    </AppText>
                  </View>
                )}
                <View className="flex-row items-center gap-1">
                  <Award size={14} color={mutedColor} />
                  <AppText variant="caption">Visit Fee: ৳{fees}</AppText>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row justify-end gap-2">
                {(isAdmin || !isDoctor) && item.status === "SCHEDULED" && (
                  <AppButton
                    title="Cancel Visit"
                    variant="outline"
                    onPress={() => handleCancel(item.id)}
                    loading={isCancelling}
                    style={{ height: 36, flex: 1 }}
                  />
                )}
                {isDoctor && item.status === "SCHEDULED" && (
                  <AppButton
                    title="Initiate Consultation"
                    onPress={() => handleStart(item.id)}
                    loading={isStarting}
                    style={{ height: 36, flex: 1 }}
                  />
                )}
                {isDoctor && item.status === "PENDING_PAYMENT" && (
                  <AppButton
                    title="Complete Visit"
                    onPress={() => handleFinish(item.id)}
                    loading={isFinishing}
                    style={{ height: 36, flex: 1 }}
                  />
                )}
              </View>
            </AppCard>
          );
        }}
      />
    </ScreenWrapper>
  );
}
