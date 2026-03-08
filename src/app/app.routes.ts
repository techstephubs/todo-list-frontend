import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    children: [],
  },
  {
    path: 'signup',
    children: [],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
