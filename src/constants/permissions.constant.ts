export const PERMISSIONS = {
  READ_DOCTORS: "read:doctors",
  READ_PATIENTS: "read:patients",
  READ_TIMESLOTS: "read:timeslots",
  MANAGE_PERMISSIONS: "manage:permissions",
  MANAGE_ADMINS: "manage:admins",
} as const;

export type TPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
