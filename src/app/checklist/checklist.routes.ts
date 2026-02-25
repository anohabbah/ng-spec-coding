import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./checklist.page').then((m) => m.ChecklistPage),
  },
];

export default routes;
