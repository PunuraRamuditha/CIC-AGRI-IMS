import React from 'react';
import { useAuth } from '../context/AuthContext';
import type { Permission, UserRole } from '../types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  role?: UserRole | UserRole[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

/**
 * RoleGuard component for conditional rendering based on user permissions and roles
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  permission,
  role,
  fallback = null,
}) => {
  const { hasPermission, hasRole } = useAuth();

  // Check permission if provided
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check role if provided
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;
