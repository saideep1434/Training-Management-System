import { Routes } from "@angular/router";
import { CohortRoutes } from "src/app/common/cohort/cohort.routes";
import { LearningPathRoutes } from "src/app/common/learning-path/learning-path.routes";
import { CoachComponent } from "./coach.component";

export const CoachRoutes: Routes = [
    {
        path: '',
        children: [
            
            { path: '', component: CoachComponent },
            ...CohortRoutes,
            ...LearningPathRoutes,
        ],
    },
];