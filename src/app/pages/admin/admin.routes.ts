import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RequestTypeManagementComponent } from './request-type-management/request-type-management.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    title: 'Panel de Administración'
  },
  {
    path: 'usuarios',
    component: UserManagementComponent,
    title: 'Gestión de Usuarios'
  },
  {
    path: 'tipos-solicitud',
    component: RequestTypeManagementComponent,
    title: 'Tipos de Solicitud'
  }
];
