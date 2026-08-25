import React from "react";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";

interface IAdminScreenLayoutProps {
  /** Optional active route path (retained for prop compatibility) */
  activeRoute?: any;
  /** Page title (retained for prop compatibility) */
  title?: string;
  /** Optional pull-to-refresh callback */
  onRefresh?: () => void;
  refreshing?: boolean;
  children: React.ReactNode;
}

/**
 * SHARED LAYOUT WRAPPER FOR ADMIN SCREENS
 * Wraps content in ScreenWrapper without extra top headers.
 */
export default function AdminScreenLayout({
  onRefresh,
  refreshing = false,
  children,
}: IAdminScreenLayoutProps) {
  return (
    <ScreenWrapper
      scrollable
      onRefresh={onRefresh}
      refreshing={refreshing}
      padding={16}
    >
      {children}
    </ScreenWrapper>
  );
}
