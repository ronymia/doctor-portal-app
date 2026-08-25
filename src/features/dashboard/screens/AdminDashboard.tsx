import { router } from "expo-router";
import React, { useEffect } from "react";

/**
 * ADMIN DASHBOARD — ENTRY REDIRECT
 *
 * Admin users land here from the home role-router.
 * We immediately redirect to the proper admin Stack route (/admin).
 * All admin screens now live under app/admin/ as separate Expo Router screens.
 *
 * Navigation flow:
 *   app/(tabs)/index → HomeScreen → home/index (role router)
 *   → AdminDashboard → router.replace('/admin')
 *   → app/admin/index.tsx (Overview)
 *   → sidebar tap → app/admin/doctors.tsx / patients.tsx / etc.
 */
const AdminDashboard: React.FC = () => {
  useEffect(() => {
    // REDIRECT TO THE ADMIN STACK IMMEDIATELY
    router.replace("/admin" as any);
  }, []);

  return null;
};

export default AdminDashboard;
