/**
 * HOMESCREEN — RE-EXPORT
 *
 * The monolithic HomeScreen has been refactored into focused role-specific
 * dashboards. This file re-exports the role router so the existing
 * app/(tabs)/index.tsx import chain continues to work unchanged.
 *
 * New structure:
 *   src/screens/home/index.tsx          ← Role router (renders correct dashboard)
 *   src/screens/home/AdminDashboard.tsx
 *   src/screens/home/DoctorDashboard.tsx
 *   src/screens/home/PatientDashboard.tsx
 *   src/screens/admin/AdminOverview.tsx
 *   src/screens/admin/AdminDoctors.tsx
 *   src/screens/admin/AdminPatients.tsx
 *   src/screens/admin/AdminTimeSlots.tsx
 *   src/screens/admin/AdminPermissions.tsx
 *   src/screens/admin/AdminAdmins.tsx
 *   src/screens/components/AdminSidebar.tsx
 */
export { default } from "../../dashboard/screens/index";
