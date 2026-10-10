import { Routes } from "@angular/router";
import { CrComponent } from "./cr.component";
import { CohortRoutes } from "src/app/common/cohort/cohort.routes";
import { LearningPathRoutes } from "src/app/common/learning-path/learning-path.routes";


export const CrRoutes : Routes = [{

    path: '',
    children: [
        {
            path: '',
            component: CrComponent
        },
        ...CohortRoutes,
        ...LearningPathRoutes
    ]


}]
