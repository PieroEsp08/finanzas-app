import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/dashboard/pages/dashboard-page/dashboard-page'
          ).then((m) => m.DashboardPage),
      },

      {
        path: 'finanzas',
        loadComponent: () =>
          import(
            './features/finanzas/pages/finanzas-page/finanzas-page'
          ).then((m) => m.FinanzasPage),
      },

      {
        path: 'ingresos',
        loadComponent: () =>
          import(
            './features/ingresos/pages/ingresos-page/ingresos-page'
          ).then((m) => m.IngresosPage),
      },

      {
        path: 'gastos',
        loadComponent: () =>
          import(
            './features/gastos/pages/gastos-page/gastos-page'
          ).then((m) => m.GastosPage),
      },

      {
        path: 'reportes',
        loadComponent: () =>
          import(
            './features/reportes/pages/reportes-page/reportes-page'
          ).then((m) => m.ReportesPage),
      },
    ],
  },
];
