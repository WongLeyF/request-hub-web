import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'requests',
        loadChildren: () => import('./pages/requests/requests.routes').then(m => m.REQUESTS_ROUTES)
      },
      {
        path: 'approvals',
        loadChildren: () => import('./pages/approvals/approvals.routes').then(m => m.APPROVALS_ROUTES),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['supervisor', 'admin'] }
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['supervisor', 'admin'] }
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [AuthGuard],
        title: 'Reportes'
      }
      // {
      //   path: 'admin',
      //   loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
      //   canActivate: [RoleGuard],
      //   data: { roles: ['admin'] }
      // }
    ]
  },
  { path: 'unauthorized', loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent) },
  { path: '**', redirectTo: 'login' }
];
