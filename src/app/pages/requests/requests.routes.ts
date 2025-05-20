import { Routes } from '@angular/router';

export const REQUESTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./request-list/request-list.component').then(c => c.RequestListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./create-request/create-request.component').then(c => c.CreateRequestComponent)
  },
  {
    path: 'new/:type',
    loadComponent: () => import('./create-request/create-request.component').then(c => c.CreateRequestComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./create-request/create-request.component').then(c => c.CreateRequestComponent),
    data: { isEditing: true }
  },
  {
    path: ':id',
    loadComponent: () => import('./request-detail/request-detail.component').then(c => c.RequestDetailComponent)
  }
];
