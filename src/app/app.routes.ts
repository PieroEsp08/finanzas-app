import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page')
      .then((m) => m.LoginPage),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },  

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page/dashboard-page')
          .then((m) => m.DashboardPage),
        data: { titulo: 'Dashboard', subtitulo: 'Resumen general de tus finanzas' }
      },

      {
        path: 'finanzas',
        loadComponent: () =>
          import('./features/finanzas/pages/finanzas-page/finanzas-page')
          .then((m) => m.FinanzasPage),
        data: { titulo: 'Finanzas', subtitulo: 'Gestión global de cuentas y saldos' }
      },

      {
        path: 'ingresos',
        loadComponent: () =>
          import('./features/ingresos/pages/ingresos-page/ingresos-page')
          .then((m) => m.IngresosPage),
        data: { titulo: 'Ingresos', subtitulo: 'Historial y registro de tus entradas de dinero' }
      },

      {
        path: 'gastos',
        loadComponent: () =>
          import('./features/gastos/pages/gastos-page/gastos-page')
          .then((m) => m.GastosPage),
        data: { titulo: 'Gastos', subtitulo: 'Controla en qué estás gastando tu dinero' }
      },

      {
        path: 'metas',
        loadComponent: () =>
          import('./features/metas/pages/metas-page/metas-page')
          .then((m) => m.MetasPage),
        data: { titulo: 'Metas', subtitulo: 'Alcanza tus objetivos financieros paso a paso' }
      },

      {
        path: 'presupuesto',
        loadComponent: () =>
          import('./features/presupuesto/pages/presupuesto-page/presupuesto-page')
          .then((m) => m.PresupuestoPage),
        data: { titulo: 'Presupuestos', subtitulo: 'Define límites mensuales por categoría' }
      },

      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reportes/pages/reportes-page/reportes-page')
          .then((m) => m.ReportesPage),
        data: { titulo: 'Reportes', subtitulo: 'Gráficos detallados de tu comportamiento financiero' }
      },

      {
        path: 'configuracion',
        loadComponent: () =>
          import('./features/configuracion/pages/configuracion-page/configuracion-page')
          .then((m) => m.ConfiguracionPage),
        data: { titulo: 'Configuración', subtitulo: 'Gestiona las preferencias y seguridad de tu cuenta' }
      },

      {
        path: 'ayuda',
        loadComponent: () =>
          import('./features/ayuda/pages/ayuda-page/ayuda-page')
          .then((m) => m.AyudaPage),
        data: { titulo: 'Ayuda', subtitulo: 'Preguntas frecuentes y guía de uso' }
      },
    ],
  },
];