import { useGetUsersQuery } from "@/src/store/api";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logout } from "@/src/store/slices/authSlice";
import { router } from "expo-router";
import { useState } from "react";

/**
 * SHARED HOOK FOR ALL ADMIN SCREENS
 * Provides sidebar visibility, user info, role flags, pending count,
 * and logout — so each admin screen doesn"t repeat this boilerplate.
 */
export function useAdminScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // SIDEBAR VISIBILITY STATE
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // FETCH ALL USERS TO COMPUTE PENDING DOCTOR BADGE
  const { data: allUsersResponse } = useGetUsersQuery({});
  const allUsers = allUsersResponse?.data || [];

  const pendingDoctorsCount = allUsers.filter(
    (u: any) => u.role === "DOCTOR" && u.status === "PENDING_VERIFICATION",
  ).length;

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return {
    user,
    isSuperAdmin,
    sidebarVisible,
    setSidebarVisible,
    pendingDoctorsCount,
    handleLogout,
  };
}
