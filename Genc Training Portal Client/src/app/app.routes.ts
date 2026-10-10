import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { DashboardComponent } from './pages/academic-coordinator/dashboard/dashboard.component';

// Import your AuthGuard and UserProfile type
import { AuthGuard } from './guards/auth.guard';
import { UserProfile } from './services/auth.service';
import { TechTrainerComponent } from './pages/tech-trainer/tech-trainer.component';
import { CoachComponent } from './pages/coach/coach.component';
import { BhTrainerComponent } from './pages/bh-trainer/bh-trainer.component';
import { MentorComponent } from './pages/mentor/mentor.component';
import { CrComponent } from './pages/cr/cr.component';
import { AppTechTrainerComponent } from './common/tech-trainer/tech-trainer.component';
import { AppCoachComponent } from './common/coach/coach.component';
import { AppBhTrainerComponent } from './common/bh-trainer/bh-trainer.component';
import { AppMentorComponent } from './common/mentor/mentor.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { ProfileComponent } from './pages/profile/profile.component';
// import { AppSideLoginComponent } from './pages/authentication/side-login/side-login.component';


export const routes: Routes = [
  {
    path: '',

    children: [
      {
        path: '',
        redirectTo: '/authentication/login',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: FullComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ProfileComponent }
        ],
        data: {
          roles: [
            'ROLE_ADMIN', 'ROLE_SKILLING_LEAD', 'ROLE_ACADEMY_COORDINATOR',
            'ROLE_TECHNICAL_TRAINER', 'ROLE_COACH', 'ROLE_BH_TRAINER',
            'ROLE_MENTOR', 'ROLE_CR'
          ] as UserProfile[],
        },
      },
      {
        path: 'academic-coordinator', // Existing lazy-loaded UI components
        component: FullComponent,
        loadChildren: () =>
          import('./pages/academic-coordinator/academic-coordinator.routes').then(
            (m) => m.AcademicCoordinatorRoutes
          ),
        canActivate: [AuthGuard], // Still protected
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_SKILLING_LEAD', 'ROLE_ACADEMY_COORDINATOR'] as UserProfile[],
        },
      },
      // --- Lazy-Loaded Role-Specific Routes ---
      {
        path: 'admin',
        component: FullComponent,
        loadChildren: () =>
          import('./pages/admin/admin.routes').then(
            (m) => m.AdminRoutes
          ),
        canActivate: [AuthGuard], // Guard the loading of the module
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_ACADEMY_COORDINATOR', 'ROLE_GUEST'] as UserProfile[],
        },
      },
      {
        path: 'skilling-lead',
        component: FullComponent,
        loadChildren: () =>
          import('./pages/skilling-lead/skilling-lead.routes').then(
            (m) => m.SkillingLeadRoutes
          ),
        canActivate: [AuthGuard],
        data: {
          roles: ['ROLE_SKILLING_LEAD', 'ROLE_ADMIN'] as UserProfile[],
        },
      },
      {
        path: 'tech-trainer',
        component: FullComponent,
        loadChildren: () =>
          import('./pages/tech-trainer/tech-trainer.routes').then(
            (m) => m.TechTrainerRoutes
          ),
        canActivate: [AuthGuard],
        data: {
          roles: ['ROLE_TECHNICAL_TRAINER', 'ROLE_SKILLING_LEAD', 'ROLE_ADMIN'] as UserProfile[],
        },
      },
      {
        path: 'coach',
        component: FullComponent,
        loadChildren: () =>
          import('./pages/coach/coach.routes').then(
            (m) => m.CoachRoutes
          ),
        canActivate: [AuthGuard],
        data: {
          roles: ['ROLE_COACH', 'ROLE_SKILLING_LEAD', 'ROLE_ADMIN'] as UserProfile[],
        },
      },
      {
        path: 'bh-trainer',
        component: FullComponent,
        loadChildren: () =>
          import('./pages/bh-trainer/bh-trainer.routes').then(
            (m) => m.BhTrainerRoutes
          ),
        canActivate: [AuthGuard],
        data: {
          roles: ['ROLE_BH_TRAINER', 'ROLE_SKILLING_LEAD', 'ROLE_ADMIN'] as UserProfile[],
        },
      },
      {
        path: 'mentor',
        component: FullComponent,
        loadChildren: () =>
          import('./pages/mentor/mentor.routes').then(
            (m) => m.MentorRoutes
          ),
        canActivate: [AuthGuard],
        data: {
          roles: ['ROLE_MENTOR', 'ROLE_SKILLING_LEAD', 'ROLE_ADMIN'] as UserProfile[],
        },
      },
      {
        path: 'cr',
        component: FullComponent,
        loadChildren: () =>
          import('./pages/cr/cr.routes').then(
            (m) => m.CrRoutes
          ),
        canActivate: [AuthGuard],
        data: {
          roles: ['ROLE_CR', 'ROLE_ACADEMY_COORDINATOR', 'ROLE_ADMIN'] as UserProfile[],
        },
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];

