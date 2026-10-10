import { Routes } from "@angular/router";
import { DashCardsComponent } from "src/app/components/dash-cards/dash-cards.component";
import { SkillingLeadComponent } from "./skilling-lead.component";
import { CohortRoutes } from "src/app/common/cohort/cohort.routes";
import { LearningPathRoutes } from "src/app/common/learning-path/learning-path.routes";


export const SkillingLeadRoutes : Routes = [{

    path: '',
    children: [
        {
            path: '',
            component: SkillingLeadComponent
        },
        ...CohortRoutes,
        ...LearningPathRoutes
    ]


}]
