import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import AppButton from "@/src/components/common/AppButton";
import AppCard from "@/src/components/common/AppCard";
import AppText from "@/src/components/common/AppText";
import ConfirmationModal from "@/src/components/common/ConfirmationModal";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import { useAdminScreen } from "@/src/hooks/useAdminScreen";
import { useTheme } from "@/src/hooks/useTheme";
import { useAppDispatch } from "@/src/store/hooks";
import { logout } from "@/src/store/slices/authSlice";

export default function MenuScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { isSuperAdmin, user, pendingDoctorsCount } = useAdminScreen();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const primaryColor = colors.primary;
  const primaryLight = colors.primaryLight;
  const textColor = colors.text;
  const borderColor = colors.surfaceBorder;

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/(auth)/login");
  };

  const menuItems = [
    {
      title: "Specializations",
      subtitle: "Manage clinical specialties & departments",
      icon: "award" as const,
      route: "/admin/specialization",
      show: true,
    },
    {
      title: "Patients",
      subtitle: "View registered patient directories",
      icon: "users" as const,
      route: "/admin/patients",
      show: true,
    },
  ];

  return (
    <>
      <ConfirmationModal
        visible={logoutModalVisible}
        title="Confirm Logout"
        message="Are you sure you want to log out of your session?"
        confirmText="Log Out"
        cancelText="Cancel"
        type="warning"
        onConfirm={() => {
          setLogoutModalVisible(false);
          handleLogout();
        }}
        onCancel={() => setLogoutModalVisible(false)}
      />

      <ScreenWrapper scrollable useSafeArea padding={16}>
        {/* PAGE TITLE */}
        <View className="mb-4">
          <AppText weight="bold" variant="title">
            Menu
          </AppText>
          <AppText variant="bodySecondary">
            Additional administration features & session management
          </AppText>
        </View>

        {/* USER PROFILE CARD */}
        <AppCard
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            marginBottom: 20,
          }}
          bordered={false}
        >
          <View
            className="w-14 h-14 rounded-full justify-center items-center mr-4"
            style={{ backgroundColor: primaryLight }}
          >
            <AppText weight="bold" style={{ fontSize: 20, color: primaryColor }}>
              {user?.profile?.fullName ? user.profile.fullName.charAt(0).toUpperCase() : "A"}
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="bold" style={{ fontSize: 16 }}>
              {user?.profile?.fullName || "Administrator"}
            </AppText>
            <AppText variant="caption" style={{ color: primaryColor, marginTop: 2 }}>
              {isSuperAdmin ? "Super Administrator" : "Portal Administrator"}
            </AppText>
            <AppText variant="caption" style={{ color: colors.textMuted, marginTop: 2 }}>
              {user?.email || "admin@medportal.com"}
            </AppText>
          </View>
        </AppCard>

        {/* MENU OPTIONS LIST */}
        <View className="mb-6">
          <AppText weight="semibold" variant="caption" className="mb-2 px-1 uppercase tracking-wider">
            Management & Settings
          </AppText>

          <View style={{ gap: 10 }}>
            {menuItems
              .filter((item) => item.show)
              .map((item) => (
                <TouchableOpacity
                  key={item.title}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.7}
                >
                  <AppCard
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 14,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: primaryLight,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 14,
                      }}
                    >
                      <Feather name={item.icon} size={20} color={primaryColor} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <AppText weight="semibold" style={{ fontSize: 15 }}>
                        {item.title}
                      </AppText>
                      <AppText variant="caption" style={{ color: colors.textMuted, marginTop: 2 }}>
                        {item.subtitle}
                      </AppText>
                    </View>

                    <Feather name="chevron-right" size={20} color={colors.textMuted} />
                  </AppCard>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* LOGOUT BUTTON AT THE BOTTOM */}
        <View style={{ marginTop: 20, marginBottom: 40 }}>
          <AppButton
            title="Log Out Session"
            variant="outline"
            icon={<Feather name="log-out" size={18} color={primaryColor} />}
            style={{
              width: "100%",
            }}
            onPress={() => setLogoutModalVisible(true)}
          />
        </View>
      </ScreenWrapper>
    </>
  );
}
