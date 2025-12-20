# Role-Based Access Control (RBAC) Implementation

## Overview

This document describes the implementation of role-based access control in the CIC IMS web application. The system supports three distinct user roles with specific permissions and access levels.

## User Roles

### 1. Super Admin
- **Full system access** with unrestricted control
- **CRUD operations** on all panels (Assets, Users, Suppliers, Insurance)
- **QR Scanner access** with editing capabilities
- **System settings** management
- **Analytics and reporting** access

### 2. Admin
- **View-only access** to all panels
- **QR Scanner access** without editing capabilities
- **Analytics and reporting** access
- **No CRUD operations** on data

### 3. User
- **QR Scanner access only**
- **No access** to other system panels
- **Scan-only functionality** for asset audits

## Implementation Details

### 1. Type Definitions (`src/types/auth.ts`)

```typescript
export type UserRole = 'superadmin' | 'admin' | 'user';

export type Permission = 
  | 'view_overview'
  | 'view_assets'
  | 'create_assets'
  | 'update_assets'
  | 'delete_assets'
  | 'view_users'
  | 'create_users'
  | 'update_users'
  | 'delete_users'
  | 'view_suppliers'
  | 'create_suppliers'
  | 'update_suppliers'
  | 'delete_suppliers'
  | 'view_insurance'
  | 'create_insurance'
  | 'update_insurance'
  | 'delete_insurance'
  | 'use_qr_scanner'
  | 'edit_qr_data'
  | 'view_analytics'
  | 'manage_settings';
```

### 2. Role Permissions Configuration (`src/config/roles.ts`)

```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  superadmin: [
    'view_overview', 'view_assets', 'create_assets', 'update_assets', 'delete_assets',
    'view_users', 'create_users', 'update_users', 'delete_users',
    'view_suppliers', 'create_suppliers', 'update_suppliers', 'delete_suppliers',
    'view_insurance', 'create_insurance', 'update_insurance', 'delete_insurance',
    'use_qr_scanner', 'edit_qr_data', 'view_analytics', 'manage_settings'
  ],
  admin: [
    'view_overview', 'view_assets', 'view_users', 'view_suppliers', 'view_insurance',
    'use_qr_scanner', 'view_analytics'
  ],
  user: [
    'use_qr_scanner'
  ]
};
```

### 3. Enhanced AuthContext (`src/context/AuthContext.tsx`)

The AuthContext now includes permission checking functions:

```typescript
interface AuthContextType {
  // ... existing properties
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}
```

### 4. Utility Functions (`src/utils/roleUtils.ts`)

Comprehensive utility functions for role-based access control:

- `hasPermission(userRole, permission)` - Check specific permission
- `hasAnyPermission(userRole, permissions)` - Check if user has any of the permissions
- `hasAllPermissions(userRole, permissions)` - Check if user has all permissions
- `hasRole(userRole, requiredRole)` - Check specific role
- `canAccessPanel(userRole, panel)` - Check panel access
- `canCreate/Update/Delete(userRole, resource)` - Check CRUD permissions
- `canEditQRData(userRole)` - Check QR data editing permission
- `getAccessibleMenuItems(userRole)` - Get accessible menu items

### 5. RoleGuard Component (`src/components/RoleGuard.tsx`)

A reusable component for conditional rendering based on permissions:

```tsx
<RoleGuard permission="create_assets">
  <Button>Add Asset</Button>
</RoleGuard>

<RoleGuard role="superadmin">
  <AdminPanel />
</RoleGuard>
```

## Panel-Specific Implementations

### Assets Panel
- **Add Asset button**: Only visible to users with `create_assets` permission
- **Edit button**: Only visible to users with `update_assets` permission
- **Delete button**: Only visible to users with `delete_assets` permission

### Users Panel
- **Add User button**: Only visible to users with `create_users` permission
- **Edit button**: Only visible to users with `update_users` permission
- **Delete button**: Only visible to users with `delete_users` permission

### QR Scanner Panel
- **Edit button**: Only visible to users with `edit_qr_data` permission (Super Admin only)

### Dashboard Navigation
- **Menu items**: Dynamically filtered based on user permissions
- **Panel access**: Controlled by `canAccessPanel` utility function

## Usage Examples

### 1. Permission-Based Rendering

```tsx
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { hasPermission } = useAuth();

  return (
    <div>
      {hasPermission('create_assets') && (
        <Button>Add Asset</Button>
      )}
    </div>
  );
};
```

### 2. Role-Based Rendering

```tsx
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { hasRole } = useAuth();

  return (
    <div>
      {hasRole('superadmin') && (
        <AdminControls />
      )}
    </div>
  );
};
```

### 3. Using RoleGuard Component

```tsx
import RoleGuard from '../components/RoleGuard';

const MyComponent = () => {
  return (
    <div>
      <RoleGuard permission="create_assets">
        <Button>Add Asset</Button>
      </RoleGuard>
      
      <RoleGuard role={['superadmin', 'admin']}>
        <AdminPanel />
      </RoleGuard>
    </div>
  );
};
```

## Security Considerations

1. **Frontend Protection**: UI elements are hidden based on permissions
2. **Backend Validation**: All API endpoints should validate permissions server-side
3. **Permission Inheritance**: Super Admin has all permissions by default
4. **Role Hierarchy**: Super Admin > Admin > User

## Testing

To test the RBAC implementation:

1. **Super Admin**: Should see all panels and all CRUD operations
2. **Admin**: Should see all panels but no CRUD operations (view-only)
3. **User**: Should only see QR Scanner panel

## Future Enhancements

1. **Dynamic Permissions**: Allow runtime permission changes
2. **Permission Groups**: Group related permissions
3. **Audit Logging**: Track permission-based actions
4. **Role Templates**: Predefined role configurations
5. **Permission Inheritance**: Hierarchical permission system
