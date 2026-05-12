import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'finanzas', loadComponent: () => import('./pages/finanzas/finanzas').then(m => m.Finanzas) },
      { path: 'ingresos', loadComponent: () => import('./pages/ingresos/ingresos').then(m => m.Ingresos) },
      { path: 'gastos', loadComponent: () => import('./pages/gastos/gastos').then(m => m.Gastos) },
      { path: 'reportes', loadComponent: () => import('./pages/reportes/reportes').then(m => m.Reportes) },
    ]
  }
];
