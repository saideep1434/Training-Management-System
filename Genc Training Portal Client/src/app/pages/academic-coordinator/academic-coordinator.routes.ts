import { Routes } from '@angular/router';

// ui
import { AppTechTrainerComponent } from '../../common/tech-trainer/tech-trainer.component';
import { AppCoachComponent } from '../../common/coach/coach.component';
import { AppCohortComponent } from '../../common/cohort/cohort.component';
import { AppBhTrainerComponent } from '../../common/bh-trainer/bh-trainer.component';
import { AppMentorComponent } from '../../common/mentor/mentor.component';
// import { AppLearningPathComponent } from '../../common/learning-path/learning-path.component';
import { CohortDetailsComponent } from 'src/app/common/cohort-details/cohort-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppLearningPathComponent } from 'src/app/common/learning-path/learning-path.component';
import { LearningPathDetailsComponent } from 'src/app/common/learning-path-details/learning-path-details.component';
import { CohortRoutes } from 'src/app/common/cohort/cohort.routes';
import { TraineesRoutes } from 'src/app/common/trainees/trainees.routes';

export const AcademicCoordinatorRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      ...TraineesRoutes,
      {
        path: 'tech-trainer-list',
        component: AppTechTrainerComponent,
      },
      {
        path: 'coach-list',
        component: AppCoachComponent,
      },
      ...CohortRoutes,
      {
        path: 'bh-trainer-list',
        component: AppBhTrainerComponent,
      },
      {
        path: 'mentor-list',
        component: AppMentorComponent,
      },
      {
        path: 'learning-paths',
        // component: AppLearningPathComponent,
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: AppLearningPathComponent },
          {
            path: 'list/details/:id', // This is the route for details
            component: LearningPathDetailsComponent // The component to show details
          },
          {
            path: 'list/details',
            redirectTo : 'list', pathMatch: 'full'
          }
        ]
      //   children : [
      //     {
      //       path: '',
      //       component: AppLearningPathComponent 
      //     },
      //     { path: 'list', component: AppLearningPathComponent },
      //     {
      //       path: 'details/:id', // This is the route for details
      //       component: LearningPathDetailsComponent // The component to show details
      //     }
      // ]
      },
      {
        path: 'learning-paths/details/:id',
        component: LearningPathDetailsComponent
      },
      {
        // Add the Cohort Details route here
        path: 'cohort/:id', // Define the path with the dynamic parameter
        component: CohortDetailsComponent, // Link it to the CohortDetailsComponent
      },
    ],
  },
];
