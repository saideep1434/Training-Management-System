import { Routes } from '@angular/router';
import { TraineeListCommonComponent } from './trainee-list.component';
import { TraineeUploadCommonComponent } from './trainee-upload.component';

export const TraineesRoutes: Routes = [
  {
    path: 'trainees',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: TraineeListCommonComponent, data: { enableAssign: true } },
      { path: 'upload', component: TraineeUploadCommonComponent },
    ],
  },
];
