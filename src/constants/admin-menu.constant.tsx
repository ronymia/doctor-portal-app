
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from "react";

import { TPermission, PERMISSIONS } from "./permissions.constant";

export type TAdminRoute =
  | "/admin"
  | "/admin/doctors"
  | "/admin/patients"
  | "/admin/timeslots"
  | "/admin/admins"
  | "/admin/specialization";

export interface ISidebarMenuItem {
  route: TAdminRoute;
  label: string;
  Icon: React.FC<{ size: number; color: string }>;
  requiredPermission?: TPermission | string | (TPermission | string)[];
  requireAllPermissions?: boolean;
}

export const ADMIN_MENU_ITEMS: ISidebarMenuItem[] = [
  // Dashboard is accessible to anyone who can access the admin panel
  { route: "/admin", label: "Overview", Icon: (props) => <Feather name="layout" {...props} /> },
  {
    route: "/admin/doctors",
    label: "Doctors",
    Icon: (props) => <MaterialCommunityIcons name="stethoscope" {...props} />,
    requiredPermission: PERMISSIONS.READ_DOCTORS,
  },
  {
    route: "/admin/patients",
    label: "Patients",
    Icon: (props) => <Feather name="users" {...props} />,
    requiredPermission: PERMISSIONS.READ_PATIENTS,
  },
  {
    route: "/admin/timeslots",
    label: "Time Slots",
    Icon: (props) => <Feather name="clock" {...props} />,
    requiredPermission: PERMISSIONS.READ_TIMESLOTS,
  },
  {
    route: "/admin/specialization",
    label: "Specializations",
    Icon: (props) => <Feather name="award" {...props} />,
    // Specializations can be seen by those who can read doctors
    requiredPermission: PERMISSIONS.READ_DOCTORS,
  },
  {
    route: "/admin/admins",
    label: "Administrators",
    Icon: (props) => <Feather name="user" {...props} />,
    requiredPermission: PERMISSIONS.MANAGE_ADMINS,
  },
];
