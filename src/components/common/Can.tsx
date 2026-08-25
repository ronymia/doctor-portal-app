import React from "react";
import { useHasPermission, useHasRole } from "@/src/hooks/useAuthGuards";

interface ICanProps {
  permission?: string | string[];
  role?: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function Can({
  permission,
  role,
  children,
  fallback = null,
}: ICanProps) {
  const permResult = useHasPermission(permission || []);
  const roleResult = useHasRole(role || []);

  const hasPermission = permission ? permResult : true;
  const hasRole = role ? roleResult : true;

  if (hasPermission && hasRole) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
