import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';

import { RequestService } from '../../../services/request.service';
import { UserService } from '../../../services/user.service';

interface RequestApproval {
  id: number;
  approverName: string;
  approverRole: string;
  status: string;
  date: Date;
  comments: string;
  avatarUrl?: string;
}

interface RequestComment {
  id: number;
  userName: string;
  userRole: string;
  text: string;
  date: Date;
  avatarUrl?: string;
}

interface RequestDetail {
  id: string;
  subject: string;
  type: string;
  description: string;
  status: string;
  createdAt: Date;
  priority: string;
  creator: string;
  creatorId: number;
  creatorAvatar?: string;
  creatorDepartment?: string;
  dueDate?: Date;
  attachments?: any[];
  approvalHistory: RequestApproval[];
  comments: RequestComment[];
}

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatExpansionModule,
    MatBadgeModule
  ],
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  requestId: string = '';
  request: RequestDetail | null = null;
  commentForm: FormGroup;
  loading = true;
  currentUser: any;
  canApprove = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.requestId = params.get('id') || '';
      this.loadRequestDetails();
    });

    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.checkApprovalPermissions();
    });
  }

  loadRequestDetails(): void {
    this.loading = true;

    this.requestService.getRequestById(this.requestId).subscribe(
      request => {
        this.request = request as RequestDetail;
        this.loading = false;
        this.checkApprovalPermissions();
      },
      error => {
        this.snackBar.open('Error al cargar los detalles de la solicitud', 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
      }
    );
  }

  checkApprovalPermissions(): void {
    if (!this.request || !this.currentUser) return;

    // Aquí puedes implementar la lógica para verificar si el usuario actual
    // puede aprobar o rechazar la solicitud
    this.canApprove = this.currentUser.id !== this.request.creatorId &&
                      this.request.status === 'pending';
  }

  submitComment(): void {
    if (this.commentForm.valid && this.request) {
      const commentText = this.commentForm.get('comment')?.value;

      this.requestService.addComment(this.requestId, commentText).subscribe(
        () => {
          this.snackBar.open('Comentario agregado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.commentForm.reset();
          this.loadRequestDetails(); // Recargar para ver el nuevo comentario
        },
        error => {
          this.snackBar.open('Error al agregar el comentario', 'Cerrar', {
            duration: 3000
          });
        }
      );
    }
  }

  approveRequest(): void {
    if (this.request && this.canApprove) {
      this.requestService.updateRequestStatus(this.requestId, 'approved', 'La solicitud cumple con los requisitos').subscribe(
        () => {
          this.snackBar.open('Solicitud aprobada con éxito', 'Cerrar', {
            duration: 3000
          });
          this.loadRequestDetails();
        },
        error => {
          this.snackBar.open('Error al aprobar la solicitud', 'Cerrar', {
            duration: 3000
          });
        }
      );
    }
  }

  rejectRequest(): void {
    // Aquí podrías abrir un diálogo para pedir una razón de rechazo
    const reason = prompt('Por favor, indique la razón del rechazo:');
    if (reason && this.request && this.canApprove) {
      this.requestService.updateRequestStatus(this.requestId, 'rejected', reason).subscribe(
        () => {
          this.snackBar.open('Solicitud rechazada', 'Cerrar', {
            duration: 3000
          });
          this.loadRequestDetails();
        },
        error => {
          this.snackBar.open('Error al rechazar la solicitud', 'Cerrar', {
            duration: 3000
          });
        }
      );
    }
  }

  returnRequest(): void {
    // Aquí podrías abrir un diálogo para pedir detalles sobre lo que se debe corregir
    const feedback = prompt('Por favor, indique qué debe corregirse:');
    if (feedback && this.request && this.canApprove) {
      this.requestService.updateRequestStatus(this.requestId, 'returned', feedback).subscribe(
        () => {
          this.snackBar.open('Solicitud devuelta para correcciones', 'Cerrar', {
            duration: 3000
          });
          this.loadRequestDetails();
        },
        error => {
          this.snackBar.open('Error al devolver la solicitud', 'Cerrar', {
            duration: 3000
          });
        }
      );
    }
  }

  getRequestTypeLabel(): string {
    const typeMap: {[key: string]: string} = {
      'purchase': 'Compra',
      'travel': 'Viaje',
      'leave': 'Licencia',
      'expense': 'Reembolso',
      'other': 'Otro'
    };

    return this.request ? typeMap[this.request.type] || this.request.type : '';
  }

  getStatusClass(): string {
    if (!this.request) return '';

    const classMap: {[key: string]: string} = {
      'pending': 'status-pending',
      'approved': 'status-approved',
      'rejected': 'status-rejected',
      'returned': 'status-returned',
      'canceled': 'status-canceled'
    };

    return classMap[this.request.status] || '';
  }

  getStatusLabel(): string {
    if (!this.request) return '';

    const statusMap: {[key: string]: string} = {
      'pending': 'Pendiente',
      'approved': 'Aprobada',
      'rejected': 'Rechazada',
      'returned': 'Devuelta',
      'canceled': 'Cancelada'
    };

    return statusMap[this.request.status] || this.request.status;
  }

  getPriorityClass(): string {
    if (!this.request) return '';

    const classMap: {[key: string]: string} = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high',
      'urgent': 'priority-urgent'
    };

    return classMap[this.request.priority] || '';
  }

  getPriorityLabel(): string {
    if (!this.request) return '';

    const priorityMap: {[key: string]: string} = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta',
      'urgent': 'Urgente'
    };

    return priorityMap[this.request.priority] || this.request.priority;
  }

  getProgressValue(): number {
    if (!this.request) return 0;

    switch(this.request.status) {
      case 'pending': return 25;
      case 'returned': return 50;
      case 'approved': return 100;
      case 'rejected': return 100;
      default: return 0;
    }
  }
}
