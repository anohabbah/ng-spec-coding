import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'checklist',
    loadChildren: () => import('./checklist/checklist.routes'),
  },
];
