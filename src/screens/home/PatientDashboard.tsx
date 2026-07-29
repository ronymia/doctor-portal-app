import { router } from "expo-router";
import { Award, LogOut, MapPin, Search, User } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";

import AppCard from "@/src/components/common/AppCard";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import AppInput from "@/src/components/form/AppInput";
import { useTheme } from "@/src/hooks/useTheme";
import {
  useGetAvailableDoctorsQuery,
  useGetSpecializationsQuery,
} from "@/src/store/api/doctorApi";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logout } from "@/src/store/slices/authSlice";

export default function PatientDashboard() {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();

  // THEME COLOR PALETTE
  const primaryColor = colors.primary;
  const primaryLight = colors.primaryLight;
  const mutedColor = colors.textMuted;
  const textColor = colors.text;
  const borderColor = colors.surfaceBorder;

  const user = useAppSelector((state) => state.auth.user);

  // LOCAL FILTER STATE
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { control } = useForm({ defaultValues: { search: "" } });

  // API QUERIES
  const { data: specResponse } = useGetSpecializationsQuery({});
  const {
    data: doctorsResponse,
    isLoading: isLoadingDocs,
    isFetching: isFetchingDocs,
    refetch: refetchDocs,
  } = useGetAvailableDoctorsQuery({
    search: searchTerm || undefined,
    specializationId: selectedSpecialty || undefined,
  });

  const specializations = specResponse?.data || [];
  const availableDoctors = doctorsResponse?.data || [];

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <ScreenWrapper
      scrollable
      onRefresh={refetchDocs}
      refreshing={isLoadingDocs || isFetchingDocs}
      padding={16}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <AppText variant="bodySecondary">Welcome back,</AppText>
          <AppText weight="bold" variant="subtitle">
            {user?.profile?.fullName || "Patient"}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="w-9 h-9 rounded-full justify-center items-center"
          style={{ backgroundColor: borderColor }}
        >
          <LogOut size={16} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View className="mb-4">
        <AppCard padding={8} style={{ borderRadius: 12 }}>
          <View className="flex-row items-center">
            <Search
              size={20}
              color={mutedColor}
              style={{ marginLeft: 8, marginRight: -4 }}
            />
            <ScrollView keyboardShouldPersistTaps="handled" className="flex-1">
              <AppInput
                name="search"
                control={control}
                placeholder="Search doctors, symptoms, clinics..."
                style={{
                  marginBottom: 0,
                  borderWidth: 0,
                  height: 40,
                  backgroundColor: "transparent",
                }}
                onChangeText={(text) => setSearchTerm(text)}
              />
            </ScrollView>
          </View>
        </AppCard>
      </View>

      {/* SPECIALTY FILTER CHIPS */}
      <View className="mb-5">
        <AppText weight="bold" variant="body" className="mb-3">
          Clinical Specialties
        </AppText>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={specializations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingRight: 20, gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = selectedSpecialty === item.id;
            return (
              <TouchableOpacity
                onPress={() =>
                  setSelectedSpecialty(isSelected ? null : item.id)
                }
                className="py-2 px-4 rounded-full border-[1.5px]"
                style={{
                  backgroundColor: isSelected
                    ? primaryColor
                    : isDark
                      ? "#151D30"
                      : "#FFFFFF",
                  borderColor,
                }}
              >
                <AppText
                  weight="medium"
                  variant="bodySecondary"
                  color={isSelected ? "#FFFFFF" : textColor}
                >
                  {item.name}
                </AppText>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* AVAILABLE DOCTORS LIST */}
      <View className="mb-5">
        <AppText weight="bold" variant="body" className="mb-3">
          Available Consultants
        </AppText>
        {isLoadingDocs || isFetchingDocs ? (
          <AppLoader />
        ) : availableDoctors.length === 0 ? (
          <AppCard bordered>
            <AppText align="center" variant="bodySecondary">
              No active doctors found for the selected specialization or search
              query.
            </AppText>
          </AppCard>
        ) : (
          <FlatList
            data={availableDoctors}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }: any) => {
              const docInfo = item.doctor;
              const specName =
                docInfo?.specialization?.name || "General Practitioner";
              const fullName =
                docInfo?.doctor?.profile?.fullName || "Consultant";
              return (
                <TouchableOpacity
                  onPress={() => router.push(`/doctor/${item.id}`)}
                  activeOpacity={0.9}
                >
                  <AppCard style={{ marginBottom: 12 }}>
                    <View className="flex-row items-center">
                      {/* AVATAR */}
                      <View
                        className="w-[60px] h-[60px] rounded-full justify-center items-center mr-3"
                        style={{ backgroundColor: primaryLight }}
                      >
                        <User size={24} color={primaryColor} />
                      </View>
                      <View className="flex-1">
                        <AppText weight="bold" variant="body">
                          {fullName}
                        </AppText>
                        <AppText
                          variant="bodySecondary"
                          className="mt-0.5 mb-1.5"
                        >
                          {specName}
                        </AppText>
                        {/* QUALIFICATION */}
                        <View className="flex-row items-center mt-0.5 gap-1">
                          <Award size={14} color={primaryColor} />
                          <AppText variant="caption">
                            {docInfo?.qualification || "MBBS"}
                          </AppText>
                        </View>
                        {/* AVAILABLE DATE */}
                        <View className="flex-row items-center mt-0.5 gap-1">
                          <MapPin size={14} color={mutedColor} />
                          <AppText variant="caption">
                            {item.availableDate
                              ? new Date(
                                  item.availableDate,
                                ).toLocaleDateString()
                              : "Available"}
                          </AppText>
                        </View>
                      </View>
                    </View>
                  </AppCard>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
