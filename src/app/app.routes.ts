import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'register',
    pathMatch: 'full',
    redirectTo: 'signup',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
