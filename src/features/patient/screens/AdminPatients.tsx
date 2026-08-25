import { View } from "react-native";

import AppCard from "@/src/components/common/AppCard";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import EmptyState from "@/src/components/common/EmptyState";
import { useTheme } from "@/src/hooks/useTheme";
import AdminScreenLayout from "@/src/layouts/AdminScreenLayout";
import { useGetUsersQuery } from "@/src/store/api";

// ADMIN PATIENTS — FULLY SELF-CONTAINED SCREEN
export default function AdminPatients() {
  const { colors } = useTheme();

  // THEME COLOR PALETTE
  const primaryColor = colors.primary;
  const mutedColor = colors.textMuted;

  const { data: allUsersResponse, isLoading, refetch } = useGetUsersQuery({});
  const allUsers = allUsersResponse?.data || [];
  const patients = allUsers.filter((u: any) => u.role === "PATIENT");

  return (
    <AdminScreenLayout
      activeRoute="/admin/patients"
      title="Patients"
      onRefresh={refetch}
      refreshing={false}
    >
      {isLoading ? (
        <AppLoader />
      ) : (
        <View>
          <AppText weight="bold" variant="body" className="mb-3">
            Enrolled Patients
          </AppText>

          {patients.length === 0 ? (
            <EmptyState message="No patients found in the register." />
          ) : (
            patients.map((u: any) => (
              <AppCard style={{ marginBottom: 12, padding: 14 }} key={u.id}>
                {/* PATIENT NAME + PHONE */}
                <View className="flex-row justify-between items-center mb-1">
                  <AppText weight="bold">
                    {u.profile?.fullName || "Patient Name"}
                  </AppText>
                  <AppText variant="caption" color={primaryColor}>
                    {u.phoneNumber}
                  </AppText>
                </View>

                {/* EMAIL */}
                <AppText
                  variant="caption"
                  color={mutedColor}
                  style={{ marginBottom: 4 }}
                >
                  Email: {u.email}
                </AppText>

                {/* MEDICAL HISTORY (IF AVAILABLE) */}
                {u.patient?.medicalHistory && (
                  <AppText variant="caption" style={{ fontStyle: "italic" }}>
                    History: {u.patient.medicalHistory}
                  </AppText>
                )}
              </AppCard>
            ))
          )}
        </View>
      )}
    </AdminScreenLayout>
  );
}
