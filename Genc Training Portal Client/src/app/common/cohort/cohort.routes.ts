import { CohortCardComponent } from "src/app/components/cohort-card/cohort-card.component";
import { AppCohortComponent } from "./cohort.component";
import { Routes } from "@angular/router";
import { CohortDetailsComponent } from "src/app/common/cohort-details/cohort-details.component";


export const CohortRoutes: Routes = [
  {
    path: 'cohort-list',
    children: [
      {
        path: '',
        component: AppCohortComponent,
      },
      {
        path: 'cohort/:id',
        component: CohortDetailsComponent,
      },
    ],
  },
];