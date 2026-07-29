import { TPermission } from "@/src/constants/permissions.constant";

/**
 * Checks if a user has specific permissions.
 * Super Admins automatically bypass permission checks.
 * If requireAll is true, the user must have ALL listed permissions.
 * If requireAll is false (default), the user must have ANY of the listed permissions.
 */
export const hasPermission = (
  userPermissions: string[],
  requiredPermission?: TPermission | string | (TPermission | string)[],
  isSuperAdmin?: boolean,
  requireAll: boolean = false
): boolean => {
  // Super Admins bypass permission checks
  if (isSuperAdmin) return true;
  
  // If no specific permission is required, anyone can access
  if (!requiredPermission || (Array.isArray(requiredPermission) && requiredPermission.length === 0)) {
    return true;
  }
  
  // Normalize required permissions into an array
  const requiredArray = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

  if (requireAll) {
    // User must have ALL required permissions
    return requiredArray.every((perm) => userPermissions.includes(perm));
  } else {
    // User must have AT LEAST ONE of the required permissions
    return requiredArray.some((perm) => userPermissions.includes(perm));
  }
};
