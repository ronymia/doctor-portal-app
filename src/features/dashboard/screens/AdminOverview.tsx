
import Feather from '@expo/vector-icons/Feather';
import { View } from "react-native";

import AppCard from "@/src/components/common/AppCard";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import { useAdminScreen } from "@/src/hooks/useAdminScreen";
import { useTheme } from "@/src/hooks/useTheme";
import AdminScreenLayout from "@/src/layouts/AdminScreenLayout";

// ADMIN OVERVIEW — FULLY SELF-CONTAINED SCREEN
export default function AdminOverview() {
  // THEME HOOK
  const { colors } = useTheme();

  // THEME COLOR PALETTE
  const accentColor = colors.accent;
  const successColor = colors.success;
  const primaryColor = colors.primary;
  const warningColor = colors.warning;

  const { pendingDoctorsCount } = useAdminScreen();

  const allSlots = [];

  // COMPUTE AUDIT METRICS
  const totalDocsCount = 0;
  const totalPatientsCount = 0;

  const isLoading = false;

  const handleRefresh = () => {};

  return (
    <AdminScreenLayout
      activeRoute="/admin"
      title="Overview"
      onRefresh={handleRefresh}
      refreshing={false}
    >
      {isLoading ? (
        <AppLoader />
      ) : (
        <View>
          {/* STATS GRID — 2x2 */}
          <View className="flex-row flex-wrap justify-between gap-3 mb-5">
            {/* Total Doctors */}
            <AppCard
              style={{ width: "47%", padding: 12, alignItems: "center" }}
              bordered={false}
            >
              <Feather name="clock" size={20} color={accentColor} />
              <AppText
                weight="bold"
                variant="subtitle"
                style={{ fontSize: 20, marginVertical: 4 }}
              >
                {totalDocsCount}
              </AppText>
              <AppText variant="caption">Total Doctors</AppText>
            </AppCard>

            {/* Total Patients */}
            <AppCard
              style={{ width: "47%", padding: 12, alignItems: "center" }}
              bordered={false}
            >
              <Feather name="user" size={20} color={successColor} />
              <AppText
                weight="bold"
                variant="subtitle"
                style={{ fontSize: 20, marginVertical: 4 }}
              >
                {totalPatientsCount}
              </AppText>
              <AppText variant="caption">Total Patients</AppText>
            </AppCard>

            {/* Time Slots */}
            <AppCard
              style={{ width: "47%", padding: 12, alignItems: "center" }}
              bordered={false}
            >
              <Feather name="calendar" size={20} color={primaryColor} />
              <AppText
                weight="bold"
                variant="subtitle"
                style={{ fontSize: 20, marginVertical: 4 }}
              >
                {allSlots.length}
              </AppText>
              <AppText variant="caption">Time Slots</AppText>
            </AppCard>

            {/* Pending Approvals */}
            <AppCard
              style={{ width: "47%", padding: 12, alignItems: "center" }}
              bordered={false}
            >
              <Feather name="shield" size={20} color={warningColor} />
              <AppText
                weight="bold"
                variant="subtitle"
                style={{ fontSize: 20, marginVertical: 4 }}
              >
                {pendingDoctorsCount}
              </AppText>
              <AppText variant="caption">Pending Approvals</AppText>
            </AppCard>
          </View>

          {/* SPECIALIZATIONS LIST */}
          {/* <View className="mb-5">
                      <AppText weight="bold" variant="body" className="mb-3">
                        Specializations Offered
                      </AppText>
                      {specializations.length === 0 ? (
                        <AppCard bordered>
                          <AppText align="center" variant="bodySecondary">
                            No specializations configured yet.
                          </AppText>
                        </AppCard>
                      ) : (
                        specializations.map((spec: any) => (
                          <AppCard style={{ marginBottom: 8, padding: 12 }} key={spec.id}>
                            <AppText weight="semibold">{spec.name}</AppText>
                            <AppText variant="caption" className="mt-0.5">
                              {spec.description || "N/A"}
                            </AppText>
                          </AppCard>
                        ))
                      )}
                    </View> */}

          {/* CLINICAL SERVICES LIST */}
          {/* <View className="mb-5">
                      <AppText weight="bold" variant="body" className="mb-3">
                        Clinical Services
                      </AppText>
                      {allServices.length === 0 ? (
                        <AppCard bordered>
                          <AppText align="center" variant="bodySecondary">
                            No services available yet.
                          </AppText>
                        </AppCard>
                      ) : (
                        allServices.slice(0, 5).map((service: any) => (
                          <AppCard
                            style={{ marginBottom: 8, padding: 12 }}
                            key={service.id}
                          >
                            <AppText weight="semibold">{service.name}</AppText>
                            <AppText variant="caption" className="mt-0.5">
                              {service.description || "N/A"}
                            </AppText>
                          </AppCard>
                        ))
                      )}
                    </View> */}
        </View>
      )}
    </AdminScreenLayout>
  );
}
