import { Routes } from '@angular/router';
import { AppLearningPathComponent } from './learning-path.component';
import { LearningPathDetailsComponent } from '../learning-path-details/learning-path-details.component';


export const LearningPathRoutes : Routes = [
    {
        path: 'learning-path-list',
        children: [
            // { path: '', redirectTo: '', pathMatch: 'full' },
            { path: '', component: AppLearningPathComponent },
            {
              path: 'details/:id', // This is the route for details
              component: LearningPathDetailsComponent // The component to show details
            }
        ]
    }
]