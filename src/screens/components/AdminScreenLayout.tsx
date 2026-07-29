import { router } from "expo-router";
import { Menu } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import AppText from "@/src/components/common/AppText";
import ConfirmationModal from "@/src/components/common/ConfirmationModal";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import { TAdminRoute } from "@/src/constants";
import { useAdminScreen } from "@/src/hooks/useAdminScreen";
import { useTheme } from "@/src/hooks/useTheme";
import AdminSidebar from "../../layouts/AdminSidebar";

interface IAdminScreenLayoutProps {
  /** The route path of the current screen, for sidebar active highlight */
  activeRoute: TAdminRoute;
  /** Page title shown in the header next to the hamburger */
  title: string;
  /** Optional badge count shown next to title (e.g. pending doctors) */
  onRefresh?: () => void;
  refreshing?: boolean;
  children: React.ReactNode;
}

/**
 * SHARED LAYOUT WRAPPER FOR ALL ADMIN SCREENS
 * Renders the sidebar drawer + hamburger header + ScreenWrapper.
 * Each admin route screen imports this to stay lean.
 */
export default function AdminScreenLayout({
  activeRoute,
  title,
  onRefresh,
  refreshing = false,
  children,
}: IAdminScreenLayoutProps) {
  const { colors } = useTheme();

  // THEME COLOR PALETTE
  const textColor = colors.text;
  const borderColor = colors.surfaceBorder;
  const primaryColor = colors.primary;

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const { handleLogout, isSuperAdmin, pendingDoctorsCount, user } =
    useAdminScreen();

  // NAVIGATE TO THE SELECTED ADMIN ROUTE
  const handleNavigate = (route: TAdminRoute) => {
    router.push(route as any);
  };

  const headerBadge = isSuperAdmin ? pendingDoctorsCount : undefined;

  return (
    <>
      {/* ANIMATED SLIDE-IN SIDEBAR */}
      <AdminSidebar
        visible={sidebarVisible}
        activeRoute={activeRoute}
        isSuperAdmin={isSuperAdmin}
        pendingDoctorsCount={pendingDoctorsCount}
        userName={user?.profile?.fullName as string}
        onNavigate={handleNavigate}
        onLogout={() => {
          setSidebarVisible(false);
          setLogoutModalVisible(true);
        }}
        onClose={() => setSidebarVisible(false)}
      />

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

      <ScreenWrapper
        scrollable
        onRefresh={onRefresh}
        refreshing={refreshing}
        padding={16}
        header={
          <View
            className="flex-row items-center px-4 pt-4 pb-2"
            style={{ gap: 12 }}
          >
            {/* HAMBURGER MENU BUTTON */}
            <TouchableOpacity
              onPress={() => setSidebarVisible(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                borderWidth: 1,
                borderColor,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Menu size={20} color={textColor} />
            </TouchableOpacity>

            {/* SCREEN TITLE */}
            <View style={{ flex: 1 }}>
              <AppText variant="caption" style={{ color: primaryColor }}>
                {isSuperAdmin ? "Super Admin" : "Administrator"}
              </AppText>
              <AppText
                weight="bold"
                variant="subtitle"
                style={{ fontSize: 18 }}
              >
                {title}
              </AppText>
            </View>

            {/* OPTIONAL HEADER BADGE (e.g. pending count) */}
            {headerBadge !== undefined && headerBadge > 0 && (
              <View
                style={{
                  backgroundColor: "#F59E0B",
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <AppText
                  style={{ color: "#FFF", fontSize: 12, fontWeight: "700" }}
                >
                  {headerBadge} pending
                </AppText>
              </View>
            )}
          </View>
        }
      >
        {/* SCREEN CONTENT */}
        {children}
      </ScreenWrapper>
    </>
  );
}
