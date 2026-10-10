import { Routes } from "@angular/router";
import { FullComponent } from "src/app/layouts/full/full.component";
import { BhTrainerComponent } from "./bh-trainer.component";
import { LearningPathRoutes } from "src/app/common/learning-path/learning-path.routes";
import { CohortRoutes } from "src/app/common/cohort/cohort.routes";

export const BhTrainerRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: BhTrainerComponent,
      },
      ...CohortRoutes,
      ...LearningPathRoutes,
    ],
  },
];