// src/app/shared/constants/app-nav-items.ts (Suggested file path)

import { NavItem } from "src/app/models/interfaces/nav-item";

// 1. ADMIN NAV ITEMS
export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/admin', // Or '/admin/dashboard' if you have a specific dashboard sub-route
  },
  {
    displayName: 'cohorts',
    iconName: 'people',
    route: '/admin/cohort-list',
  },
  {
    displayName: 'Learning Paths',
    iconName: 'tool',
    route: '/admin/learning-path',
  },
  // Add more admin-specific nav items as needed
];

// 2. SKILLING LEAD NAV ITEMS
export const SKILLING_LEAD_NAV_ITEMS: NavItem[] = [
  {
    displayName: 'SL Dashboard',
    iconName: 'chart-bar',
    route: '/skilling-lead', // Or '/skilling-lead/dashboard'
  },
  {
    displayName: 'Program Management',
    iconName: 'award',
    route: '/skilling-lead/programs',
  },
  {
    displayName: 'Batch Oversight',
    iconName: 'clipboard-check',
    route: '/skilling-lead/batches',
  },
  {
    displayName: 'Reports & Analytics',
    iconName: 'report-analytics',
    route: '/skilling-lead/reports',
  },
  {
    displayName: 'Trainer Allocation',
    iconName: 'users-plus',
    route: '/skilling-lead/trainer-allocation',
  },
  // Add more skilling lead specific nav items
];

// 3. ACADEMIC COORDINATOR NAV ITEMS
export const ACADEMIC_COORDINATOR_NAV_ITEMS: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/academic-coordinator',
  },
  {
    displayName: 'Technical Trainers',
    iconName: 'user-code',
    route: '/academic-coordinator/tech-trainer-list',
  },
  {
    displayName: 'Coaches',
    iconName: 'user-check',
    route: '/academic-coordinator/coach-list',
  },
  {
    displayName: 'Cohorts',
    iconName: 'school',
    route: '/academic-coordinator/cohort-list',
  },
  {
    displayName: 'BH Trainers',
    iconName: 'users-group',
    route: '/academic-coordinator/bh-trainer-list',
  },
  {
    displayName: 'Mentors',
    iconName: 'users',
    route: '/academic-coordinator/mentor-list',
  },
  {
    displayName: 'Learning Paths',
    iconName: 'calendar-code',
    route: '/academic-coordinator/learning-paths',
  },
  {
    displayName: 'Trainees',
    iconName: 'users-group',
    route: '/academic-coordinator/trainees',
    children: [
      { displayName: 'List', iconName: 'list', route: '/academic-coordinator/trainees/list' },
      { displayName: 'Upload', iconName: 'upload', route: '/academic-coordinator/trainees/upload' },
    ],
  },
];

// 4. TECHNICAL TRAINER NAV ITEMS
export const TECH_TRAINER_NAV_ITEMS: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'chalkboard',
    route: '/tech-trainer', // Or '/tech-trainer/dashboard'
  },
  {
    displayName: 'Assigned Cohorts',
    iconName: 'packages',
    route: '/tech-trainer/cohort-list',
  },
  {
    displayName: 'Learning Paths',
    iconName: 'books',
    route: '/tech-trainer/learning-path-list',
  },
  // Add more technical trainer specific nav items
];

// 5. COACH NAV ITEMS
export const COACH_NAV_ITEMS: NavItem[] = [
  {
    displayName: 'Coach Dashboard',
    iconName: 'layout-board',
    route: '/coach', // Or '/coach/dashboard'
  },
  {
    displayName: 'Cohorts',
    iconName: 'packages',
    route: '/coach/cohort-list',
  },
  {
    displayName: 'Session Schedule',
    iconName: 'calendar',
    route: '/coach/schedule',
  },
  // Add more coach specific nav items
];

// 6. BH TRAINER NAV ITEMS
export const BH_TRAINER_NAV_ITEMS: NavItem[] = [
  {
    displayName: 'BH Trainer Dashboard',
    iconName: 'presentation-line',
    route: '/bh-trainer', // Or '/bh-trainer/dashboard'
  },
  {
    displayName: 'Training Modules',
    iconName: 'folder-open',
    route: '/bh-trainer/modules',
  },
  {
    displayName: 'Attendance',
    iconName: 'clipboard-list',
    route: '/bh-trainer/attendance',
  },
  {
    displayName: 'Assessment Results',
    iconName: 'chart-pie',
    route: '/bh-trainer/assessments',
  },
  // Add more BH Trainer specific nav items
];

// 7. MENTOR NAV ITEMS
export const MENTOR_NAV_ITEMS: NavItem[] = [
  {
    displayName: 'Mentor Dashboard',
    iconName: 'bulb',
    route: '/mentor', // Or '/mentor/dashboard'
  },
  {
    displayName: 'Cohorts',
    iconName: 'user-star',
    route: '/mentor/cohort-list',
  },
  {
    displayName: 'Learning Paths',
    iconName: 'send',
    route: '/mentor/learning-path-list',
  },
  // Add more mentor specific nav items
];

// 8. CAMPUS REPRESENTATIVE (CR) NAV ITEMS
export const CR_NAV_ITEMS: NavItem[] = [
  {
    displayName: 'CR Dashboard',
    iconName: 'building',
    route: '/cr', // Or '/cr/dashboard'
  },
  {
    displayName: 'Candidate Registrations',
    iconName: 'user-plus',
    route: '/cr/cohort-list',
  },
  {
    displayName: 'Events & Activities',
    iconName: 'calendar-event',
    route: '/cr/learning-path-list',
  },
  // {
  //   displayName: 'Admission Status',
  //   iconName: 'checks',
  //   route: '/cr/admissions',
  // },
  // Add more Campus Representative (CR) specific nav items
];

// 9. GUEST NAV ITEMS (Read-only access, same as admin)
export const GUEST_NAV_ITEMS: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/admin',
  },
  {
    displayName: 'Cohorts',
    iconName: 'people',
    route: '/admin/cohort-list',
  },
  {
    displayName: 'Learning Paths',
    iconName: 'tool',
    route: '/admin/learning-path',
  },
  // Guest users see same menu as admin but with read-only access
];

// 10. PUBLIC / LOGGED OUT NAV ITEMS (Optional, for routes outside FullComponent)
export const PUBLIC_NAV_ITEMS: NavItem[] = [
  {
    displayName: 'Home',
    iconName: 'home',
    route: '/',
  },
  {
    displayName: 'Login',
    iconName: 'lock',
    route: '/authentication/login',
  },
  // Add other public items like 'About Us', 'Contact' etc.
];

// You can also define a COMMON_NAV_ITEMS if there are items visible to ALL logged-in users regardless of role
export const COMMON_NAV_ITEMS: NavItem[] = [
    {
        displayName: 'My Profile',
        iconName: 'user-circle',
        route: '/profile'
    },
];
