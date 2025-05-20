import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { RequestService } from '../../../services/request.service';
import { ApprovalCommentDialogComponent } from '../approval-comment-dialog/approval-comment-dialog.component';

interface ApprovalRequest {
  id: string;
  subject: string;
  type: string;
  status: string;
  createdAt: Date;
  priority: string;
  description: string;
  creator: string;
  creatorDepartment: string;
  area: string;
  expanded?: boolean;
  dueDate?: Date;
}

@Component({
  selector: 'app-approval-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './approval-management.component.html',
  styleUrls: ['./approval-management.component.scss']
})
export class ApprovalManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'subject', 'type', 'creator', 'createdAt', 'actions'];
  dataSource: MatTableDataSource<ApprovalRequest>;
  pendingRequests: ApprovalRequest[] = [];

  // Filtros
  filterForm: FormGroup;
  areas: string[] = ['Todas', 'Tecnología', 'Recursos Humanos', 'Finanzas', 'Marketing', 'Operaciones'];

  // Propiedades para estadísticas
  urgentRequestsCount = 0;
  highPriorityRequestsCount = 0;
  totalRequestsCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<ApprovalRequest>([]);

    // Inicializar formulario de filtros
    this.filterForm = this.fb.group({
      area: ['Todas'],
      searchTerm: [''],
      priority: ['all']
    });
  }

  ngOnInit(): void {
    this.loadPendingApprovals();

    // Suscribirse a cambios en el formulario de filtros
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPendingApprovals(): void {
    this.requestService.getPendingApprovalsForSupervisor().subscribe(
      requests => {
        this.pendingRequests = requests;
        this.dataSource.data = requests;
        this.updateStatistics();
      },
      error => {
        this.snackBar.open('Error al cargar solicitudes pendientes', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }

  updateStatistics(): void {
    this.totalRequestsCount = this.dataSource.data.length;
    this.urgentRequestsCount = this.countRequestsByPriority('urgent');
    this.highPriorityRequestsCount = this.countRequestsByPriority('high');
  }

  countRequestsByPriority(priority: string): number {
    return this.dataSource.data.filter(request => request.priority === priority).length;
  }

  applyFilters(): void {
    const filterValue = this.filterForm.value;

    let filteredData = this.pendingRequests;

    // Filtrar por área
    if (filterValue.area !== 'Todas') {
      filteredData = filteredData.filter(request => request.area === filterValue.area);
    }

    // Filtrar por término de búsqueda
    if (filterValue.searchTerm) {
      const searchTerm = filterValue.searchTerm.toLowerCase();
      filteredData = filteredData.filter(request =>
        request.subject.toLowerCase().includes(searchTerm) ||
        request.id.toLowerCase().includes(searchTerm) ||
        request.creator.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por prioridad
    if (filterValue.priority !== 'all') {
      filteredData = filteredData.filter(request => request.priority === filterValue.priority);
    }

    this.dataSource.data = filteredData;
    this.updateStatistics();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleRequestExpansion(request: ApprovalRequest): void {
    request.expanded = !request.expanded;
  }

  openCommentDialog(action: string, request: ApprovalRequest): void {
    const dialogRef = this.dialog.open(ApprovalCommentDialogComponent, {
      width: '500px',
      data: {
        action: action,
        requestId: request.id,
        requestSubject: request.subject
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processApproval(action, request.id, result.comment);
      }
    });
  }

  processApproval(action: string, requestId: string, comment: string): void {
    let status = '';
    let message = '';

    switch(action) {
      case 'approve':
        status = 'approved';
        message = 'Solicitud aprobada correctamente';
        break;
      case 'reject':
        status = 'rejected';
        message = 'Solicitud rechazada correctamente';
        break;
      case 'return':
        status = 'returned';
        message = 'Solicitud devuelta para correcciones';
        break;
      default:
        return;
    }

    this.requestService.updateRequestStatus(requestId, status, comment).subscribe(
      () => {
        this.snackBar.open(message, 'Cerrar', {
          duration: 3000
        });
        this.loadPendingApprovals(); // Recargar la lista
      },
      error => {
        this.snackBar.open(`Error al ${action === 'approve' ? 'aprobar' : action === 'reject' ? 'rechazar' : 'devolver'} la solicitud`, 'Cerrar', {
          duration: 3000
        });
      }
    );
  }

  getRequestTypeName(type: string): string {
    const typeMap: {[key: string]: string} = {
      'purchase': 'Compra',
      'travel': 'Viaje',
      'leave': 'Licencia',
      'expense': 'Reembolso',
      'other': 'Otro'
    };

    return typeMap[type] || type;
  }

  getPriorityLabel(priority: string): string {
    const priorityMap: {[key: string]: string} = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta',
      'urgent': 'Urgente'
    };

    return priorityMap[priority] || priority;
  }

  getPriorityClass(priority: string): string {
    const classMap: {[key: string]: string} = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high',
      'urgent': 'priority-urgent'
    };

    return classMap[priority] || '';
  }
}
