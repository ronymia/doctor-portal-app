import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";

import { useState } from "react";
import { View } from "react-native";

import AppButton from "@/src/components/common/AppButton";
import AppCard from "@/src/components/common/AppCard";
import AppHeader from "@/src/components/common/AppHeader";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import { useTheme } from "@/src/hooks/useTheme";
import {
  useBookAppointmentMutation,
  useGetAvailableServiceByIdQuery,
} from "@/src/store/api";
import { useAppSelector } from "@/src/store/hooks";

interface IBookingScreenProps {
  availableServiceId: string;
}

export default function BookingScreen({
  availableServiceId,
}: IBookingScreenProps) {
  const { colors } = useTheme();
  const [isSuccess, setIsSuccess] = useState(false);

  const primaryColor = colors.primary;
  const primaryLight = colors.primaryLight;
  const successColor = colors.success;
  const errorColor = colors.error;
  const borderColor = colors.surfaceBorder;

  const user = useAppSelector((state) => state.auth.user);
  const { data: serviceResponse, isLoading } =
    useGetAvailableServiceByIdQuery(availableServiceId);
  const [bookAppointment, { isLoading: isBooking, error: bookingError }] =
    useBookAppointmentMutation();

  const serviceDetail = serviceResponse?.data;

  if (isLoading)
    return <AppLoader message="Preparing clinical slot details..." />;

  if (!serviceDetail) {
    return (
      <ScreenWrapper scrollable={false}>
        <AppHeader title="Not Found" showBackButton />
        <View className="flex-1 justify-center items-center p-5">
          <AppText align="center" variant="bodySecondary">
            Service slot details could not be found.
          </AppText>
        </View>
      </ScreenWrapper>
    );
  }

  const service = serviceDetail.service;
  const slot = serviceDetail.slot;
  const fees = serviceDetail.fees;
  const slotDate = serviceDetail.slotDate;

  const handleConfirm = async () => {
    if (!user?.patient?.id) {
      alert("Only registered Patients can book appointments.");
      return;
    }
    try {
      await bookAppointment({
        patientId: user.patient.id,
        availableServiceId,
        appointmentDate: new Date(slotDate).toISOString(),
      }).unwrap();
      setIsSuccess(true);
    } catch (err) {}
  };

  const getErrorMessage = () => {
    if (!bookingError) return null;
    if ("data" in bookingError) {
      const data = bookingError.data as any;
      return (
        data?.message ||
        "Booking failed. You might have a conflicting schedule."
      );
    }
    return "Network connection error.";
  };

  return (
    <ScreenWrapper scrollable={false} useSafeArea>
      <AppHeader title="Confirm Appointment" showBackButton={!isSuccess} />

      <View className="flex-1 px-5 justify-center">
        {isSuccess ? (
          <AppCard style={{ alignItems: "center", paddingVertical: 28 }}>
            <View
              className="w-[88px] h-[88px] rounded-full justify-center items-center mb-5"
              style={{ backgroundColor: primaryLight }}
            >
              <Feather name="heart" size={48} color={primaryColor} />
            </View>
            <AppText
              weight="bold"
              variant="subtitle"
              align="center"
              className="mb-3"
            >
              Appointment Scheduled!
            </AppText>
            <AppText
              variant="bodySecondary"
              align="center"
              style={{ lineHeight: 22 }}
              className="mb-7"
            >
              Your consultation is successfully registered. You can review your
              visit status and pay fees in the Appointments tab.
            </AppText>
            <AppButton
              title="Return to Home"
              onPress={() => router.replace("/(tabs)")}
              style={{ width: "100%" }}
            />
          </AppCard>
        ) : (
          <View className="w-full">
            <AppText
              variant="bodySecondary"
              style={{ lineHeight: 20 }}
              className="mb-4"
            >
              Please verify your consultation details before requesting
              appointment slot confirmation:
            </AppText>

            {getErrorMessage() && (
              <View
                className="p-3 rounded-md border mb-4"
                style={{
                  backgroundColor: errorColor + "15",
                  borderColor: errorColor,
                }}
              >
                <AppText variant="error" weight="medium">
                  {getErrorMessage()}
                </AppText>
              </View>
            )}

            <AppCard style={{ width: "100%" }}>
              <AppText weight="bold" variant="body" style={{ fontSize: 18 }}>
                {service?.name || "General Consultation"}
              </AppText>
              <AppText
                variant="bodySecondary"
                style={{ marginTop: 4, lineHeight: 18 }}
              >
                {service?.description}
              </AppText>

              <View
                className="h-px my-3"
                style={{ backgroundColor: borderColor }}
              />

              <View className="flex-row items-center mb-3 gap-2">
                <Feather name="user" size={18} color={primaryColor} />
                <View className="flex-1">
                  <AppText variant="caption">Patient Name</AppText>
                  <AppText weight="medium">{user?.profile?.fullName}</AppText>
                </View>
              </View>

              <View className="flex-row items-center mb-3 gap-2">
                <Feather name="calendar" size={18} color={primaryColor} />
                <View className="flex-1">
                  <AppText variant="caption">Date & Consultation Time</AppText>
                  <AppText weight="medium">
                    {new Date(slotDate).toLocaleDateString()} at{" "}
                    {slot?.startTime} - {slot?.endTime}
                  </AppText>
                </View>
              </View>

              <View className="flex-row items-center mb-3 gap-2">
                <Feather name="dollar-sign" size={18} color={primaryColor} />
                <View className="flex-1">
                  <AppText variant="caption">Consultation Fee</AppText>
                  <AppText weight="bold" color={primaryColor}>
                    ৳{fees} BDT
                  </AppText>
                </View>
              </View>
            </AppCard>

            <View className="flex-row items-center my-4 gap-1">
              <MaterialCommunityIcons name="shield-check-outline" size={16} color={successColor} />
              <AppText variant="caption" className="ml-0.5">
                Safe workspace booking. Cancel anytime without penalty.
              </AppText>
            </View>

            <AppButton
              title="Request Booking Slot"
              onPress={handleConfirm}
              loading={isBooking}
              style={{ width: "100%" }}
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
