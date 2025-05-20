import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  action: string;
  requestId: string;
  requestSubject: string;
}

@Component({
  selector: 'app-approval-comment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="{{getActionColor()}}">{{getActionIcon()}}</mat-icon>
      {{getDialogTitle()}}
    </h2>

    <mat-dialog-content>
      <p>Solicitud: <strong>{{data.requestSubject}}</strong></p>
      <p class="mb-3">Por favor, proporciona un comentario explicando tu decisión:</p>

      <form [formGroup]="commentForm">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Comentario</mat-label>
          <textarea
            matInput
            formControlName="comment"
            placeholder="Escribe tu comentario aquí"
            rows="5"
            required
          ></textarea>
          <mat-error *ngIf="commentForm.get('comment')?.hasError('required')">
            El comentario es obligatorio
          </mat-error>
          <mat-error *ngIf="commentForm.get('comment')?.hasError('minlength')">
            El comentario debe tener al menos 10 caracteres
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button
        mat-raised-button
        [disabled]="commentForm.invalid"
        (click)="submit()"
        [color]="getActionColor()"
      >
        {{getActionButtonText()}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class ApprovalCommentDialogComponent {
  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ApprovalCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  submit(): void {
    if (this.commentForm.valid) {
      this.dialogRef.close({
        comment: this.commentForm.get('comment')?.value
      });
    }
  }

  getDialogTitle(): string {
    switch(this.data.action) {
      case 'approve': return 'Aprobar Solicitud';
      case 'reject': return 'Rechazar Solicitud';
      case 'return': return 'Devolver para Correcciones';
      default: return 'Comentar Solicitud';
    }
  }

  getActionIcon(): string {
    switch(this.data.action) {
      case 'approve': return 'check_circle';
      case 'reject': return 'cancel';
      case 'return': return 'replay';
      default: return 'comment';
    }
  }

  getActionColor(): string {
    switch(this.data.action) {
      case 'approve': return 'primary';
      case 'reject': return 'warn';
      case 'return': return 'accent';
      default: return '';
    }
  }

  getActionButtonText(): string {
    switch(this.data.action) {
      case 'approve': return 'Aprobar';
      case 'reject': return 'Rechazar';
      case 'return': return 'Devolver';
      default: return 'Enviar';
    }
  }
}
