import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'data-entry',
    loadChildren: () => import('./features/data-entry/data-entry.module').then(m => m.DataEntryModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule)
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/dashboard' } // Wildcard route for 404
];
