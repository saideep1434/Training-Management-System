import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AppCohortComponent } from "src/app/common/cohort/cohort.component";
import { AppLearningPathComponent } from "src/app/common/learning-path/learning-path.component";
import { LearningPathDetailsComponent } from "src/app/common/learning-path-details/learning-path-details.component";
import { CohortRoutes } from "src/app/common/cohort/cohort.routes";


export const AdminRoutes : Routes = [{

    path: '',
    children: [
        {
            path: '',
            component: AdminComponent
        },
        ...CohortRoutes,
        // {
        //     path: 'cohort-list',
        //     component: AppCohortComponent,
        // },
        {
            path: 'learning-path',
            component: AppLearningPathComponent,
        },
        {
            path: 'learning-path/details/:id',
            component: LearningPathDetailsComponent,
        },
        {
            path: 'learning-path/details',
            redirectTo: 'learning-path',
        }
    ]


}]