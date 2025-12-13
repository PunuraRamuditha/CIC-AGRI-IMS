import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProtectedComponentProps {
  children: React.ReactNode;
  role?: string | string[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  role,
  fallback,
}) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 rounded-lg border border-slate-200">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">Authentication Required</h3>
          <p className="text-slate-500">
            Please log in to access this content.
          </p>
        </div>
      </div>
    );
  }

  const hasRoleAccess = role ? 
    (Array.isArray(role) ? role.includes(user.role) : user.role === role) : 
    true;

  if (!hasRoleAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 rounded-lg border border-slate-200">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">Access Restricted</h3>
          <p className="text-slate-500">
            You don't have permission to view this content. Required role: {Array.isArray(role) ? role.join(', ') : role}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedComponent;