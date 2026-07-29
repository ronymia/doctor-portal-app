import React from "react";

import { useAppSelector } from "@/src/store/hooks";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";

/**
 * ROLE ROUTER — reads the authenticated user's role and renders
 * the appropriate dashboard. No logic or layout lives here.
 */
const HomeRouter: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  const isAdmin = user?.role === "ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isDoctor = user?.role === "DOCTOR";

  if (isAdmin || isSuperAdmin) return <AdminDashboard />;
  if (isDoctor) return <DoctorDashboard />;

  // DEFAULT: PATIENT DASHBOARD
  return <PatientDashboard />;
};

export default HomeRouter;
