import { Routes } from "@angular/router";
import { DashCardsComponent } from "src/app/components/dash-cards/dash-cards.component";
import { MentorComponent } from "./mentor.component";
import { CohortRoutes } from "src/app/common/cohort/cohort.routes";
import { LearningPathRoutes } from "src/app/common/learning-path/learning-path.routes";

// Mentor feature routes
// - Default route redirects to 'dashboard'
// - Child paths should NOT start with a leading '/'
export const MentorRoutes: Routes = [
    {
        path: '',
        children: [
                {
                    path: '',
                    component: MentorComponent
                },
                ...CohortRoutes,
                ...LearningPathRoutes
            ]
    },
];