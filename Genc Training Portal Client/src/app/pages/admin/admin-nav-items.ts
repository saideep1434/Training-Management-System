// src/app/pages/admin/admin-nav-items.ts
import { NavItem } from '../../models/interfaces/nav-item';
import { ROLES } from '../../shared/constants/roles';

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    navCap: 'Admin Dashboard',
    allowedRoles: [ROLES.ADMIN],
  },
  {
    displayName: 'Admin Dashboard',
    iconName: 'layout-dashboard',
    route: '/admin/dashboard',
    allowedRoles: [ROLES.ADMIN],
  },
  {
    navCap: 'User Management',
    allowedRoles: [ROLES.ADMIN],
  },
  {
    displayName: 'Add People',
    iconName: 'user-plus',
    route: '/admin/add-people',
    allowedRoles: [ROLES.ADMIN],
  },
  {
    displayName: 'Manage Roles',
    iconName: 'settings',
    route: '/admin/manage-roles', // Example new route
    allowedRoles: [ROLES.ADMIN],
  },
];