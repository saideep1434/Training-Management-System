// src/app/pages/tech-trainer/tech-trainer-nav-items.ts
import { NavItem } from '../../models/interfaces/nav-item';
import { ROLES } from '../../shared/constants/roles';

export const TECH_TRAINER_NAV_ITEMS: NavItem[] = [
  {
    navCap: 'Trainer Dashboard',
    allowedRoles: [ROLES.TECHNICAL_TRAINER],
  },
  {
    displayName: 'My Trainings',
    iconName: 'book',
    route: '/tech-trainer/my-trainings',
    allowedRoles: [ROLES.TECHNICAL_TRAINER],
  },
  {
    displayName: 'View Associates',
    iconName: 'users',
    route: '/tech-trainer/associates', // You might re-route this to a trainer-specific view
    allowedRoles: [ROLES.TECHNICAL_TRAINER],
  },
];