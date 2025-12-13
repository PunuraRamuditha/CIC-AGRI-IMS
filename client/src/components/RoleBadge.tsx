import React from 'react';
import type { UserRole } from '../types/auth';
import { ROLE_CONFIG } from '../config/roles';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md', className = '' }) => {
  const config = ROLE_CONFIG[role];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${config.color} ${config.bgColor} ${config.borderColor}
      ${sizeClasses[size]}
      border
      ${className}
    `}>
      {config.label}
    </span>
  );
};

export default RoleBadge;