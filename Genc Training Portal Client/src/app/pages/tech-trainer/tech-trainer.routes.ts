import { Routes } from "@angular/router";
import { DashCardsComponent } from "src/app/components/dash-cards/dash-cards.component";
import { Cohort } from "src/app/models/class/cohort.model";
import { TechTrainerComponent } from "./tech-trainer.component";
import { FullComponent } from "src/app/layouts/full/full.component";
import { CohortCardComponent } from "src/app/components/cohort-card/cohort-card.component";
import { AppCoachComponent } from "src/app/common/coach/coach.component";
import { AppCohortComponent } from "src/app/common/cohort/cohort.component";
import { CohortRoutes } from "src/app/common/cohort/cohort.routes";
import { LearningPathRoutes } from "src/app/common/learning-path/learning-path.routes";


export const TechTrainerRoutes : Routes = [{

    path: '',
    // component: FullComponent,
    children: [
        {
            path: '',
            component: TechTrainerComponent
        },
        ...CohortRoutes,
        ...LearningPathRoutes
    ]


}]