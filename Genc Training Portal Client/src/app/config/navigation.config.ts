import { NavItem } from '../models/interfaces/nav-item';

export interface NavigationConfig {
  role: string;
  navigationItems: NavItem[];
  permissions?: string[];
}

// This configuration can be easily extended without touching the service
export const NAVIGATION_ROLE_MAPPING = {
  'ROLE_ADMIN': 'ADMIN_NAV_ITEMS',
  'ROLE_SKILLING_LEAD': 'SKILLING_LEAD_NAV_ITEMS',
  'ROLE_ACADEMY_COORDINATOR': 'ACADEMIC_COORDINATOR_NAV_ITEMS',
  'ROLE_TECHNICAL_TRAINER': 'TECH_TRAINER_NAV_ITEMS',
  'ROLE_COACH': 'COACH_NAV_ITEMS',
  'ROLE_BH_TRAINER': 'BH_TRAINER_NAV_ITEMS',
  'ROLE_MENTOR': 'MENTOR_NAV_ITEMS',
  'ROLE_CR': 'CR_NAV_ITEMS',
  'ROLE_GUEST': 'GUEST_NAV_ITEMS',
} as const;

export type SupportedRole = keyof typeof NAVIGATION_ROLE_MAPPING;

