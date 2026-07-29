import { useAppSelector } from '../src/store/hooks';

export const useHasRole = (roles: string | string[]): boolean => {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return false;

  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  const userRole = user.role?.toUpperCase();
  return requiredRoles.map((r) => r.toUpperCase()).includes(userRole);
};

export const useHasPermission = (permissions: string | string[]): boolean => {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return false;

  // SUPER_ADMIN automatically satisfies all permission requirements
  if (user.role?.toUpperCase() === 'SUPER_ADMIN') {
    return true;
  }

  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
  const userPermissions = user.permissions || [];
  return requiredPermissions.every((perm) => userPermissions.includes(perm));
};
