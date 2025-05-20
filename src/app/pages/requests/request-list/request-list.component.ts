import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { RequestService } from '../../../services/request.service';

interface Request {
  id: string;
  subject: string;
  type: string;
  status: string;
  createdAt: Date;
  // priority: string;
  description: string;
  creator: string;
  dueDate?: Date;
}

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'subject', 'type', 'status', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<Request>;
  selectedStatus: string = 'all';
  allRequests: Request[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private requestService: RequestService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Request>([]);
  }

  ngOnInit() {
    // Cargar solicitudes
    this.loadRequests();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar la función de filtrado personalizada
    this.dataSource.filterPredicate = (data: Request, filter: string) => {
      return data.subject.toLowerCase().includes(filter) ||
             data.id.toLowerCase().includes(filter);
    };
  }

  loadRequests() {
    this.requestService.getRequests().subscribe(requests => {
      this.allRequests = requests;
      this.dataSource.data = requests;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByStatus() {
    if (this.selectedStatus === 'all') {
      this.dataSource.data = this.allRequests;
    } else {
      this.dataSource.data = this.allRequests.filter(request => request.status === this.selectedStatus);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewRequestDetails(request: Request, event: Event) {
    // Evitar la propagación para que el click no dispare el routerLink de la fila
    event.stopPropagation();
    this.router.navigate(['/requests', request.id]);
  }

  editRequest(request: Request, event: Event) {
    // Evitar la propagación para que el click no dispare el routerLink de la fila
    event.stopPropagation();
    this.router.navigate(['/requests/edit', request.id]);
  }

  cancelRequest(request: Request, event: Event) {
    // Evitar la propagación para que el click no dispare el routerLink de la fila
    event.stopPropagation();

    if (confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      this.requestService.cancelRequest(request.id).subscribe(
        () => {
          this.snackBar.open('Solicitud cancelada correctamente', 'Cerrar', {
            duration: 3000
          });
          this.loadRequests(); // Recargar la lista
        },
        error => {
          this.snackBar.open('Error al cancelar la solicitud', 'Cerrar', {
            duration: 3000
          });
        }
      );
    }
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'approved': 'Aprobada',
      'rejected': 'Rechazada',
      'returned': 'Devuelta',
      'canceled': 'Cancelada'
    };

    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'approved': 'status-approved',
      'rejected': 'status-rejected',
      'returned': 'status-returned',
      'canceled': 'status-canceled'
    };

    return classMap[status] || '';
  }

  getPriorityLabel(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta',
      'urgent': 'Urgente'
    };

    return priorityMap[priority] || priority;
  }

  getPriorityClass(priority: string): string {
    const classMap: { [key: string]: string } = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high',
      'urgent': 'priority-urgent'
    };

    return classMap[priority] || '';
  }

  getRequestTypeName(type: string): string {
    const typeMap: { [key: string]: string } = {
      'purchase': 'Compra',
      'travel': 'Viaje',
      'leave': 'Licencia',
      'expense': 'Reembolso',
      'other': 'Otro'
    };

    return typeMap[type] || type;
  }
}
