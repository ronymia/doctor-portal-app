import {
  Clock,
  LayoutDashboard,
  Stethoscope,
  UserCog,
  Users,
} from "lucide-react-native";
import React from "react";

import { TPermission, PERMISSIONS } from "./permissions.constant";

export type TAdminRoute =
  | "/admin"
  | "/admin/doctors"
  | "/admin/patients"
  | "/admin/timeslots"
  | "/admin/admins";

export interface ISidebarMenuItem {
  route: TAdminRoute;
  label: string;
  Icon: React.FC<{ size: number; color: string }>;
  requiredPermission?: TPermission | string | (TPermission | string)[];
  requireAllPermissions?: boolean;
}

export const ADMIN_MENU_ITEMS: ISidebarMenuItem[] = [
  // Dashboard is accessible to anyone who can access the admin panel
  { route: "/admin", label: "Overview", Icon: LayoutDashboard },
  {
    route: "/admin/doctors",
    label: "Doctors",
    Icon: Stethoscope,
    requiredPermission: PERMISSIONS.READ_DOCTORS,
  },
  {
    route: "/admin/patients",
    label: "Patients",
    Icon: Users,
    requiredPermission: PERMISSIONS.READ_PATIENTS,
  },
  {
    route: "/admin/timeslots",
    label: "Time Slots",
    Icon: Clock,
    requiredPermission: PERMISSIONS.READ_TIMESLOTS,
  },
  {
    route: "/admin/admins",
    label: "Administrators",
    Icon: UserCog,
    requiredPermission: PERMISSIONS.MANAGE_ADMINS,
  },
];
