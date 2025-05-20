import { Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';

export const APPROVALS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./approval-management/approval-management.component')
      .then(c => c.ApprovalManagementComponent),
    canActivate: [RoleGuard],
    data: { roles: ['supervisor', 'admin'] }
  }
];
