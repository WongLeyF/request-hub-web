import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';

interface DialogData {
  user?: User;
  isNew: boolean;
}

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {
  userForm: FormGroup;
  isNew: boolean;

  roles: {value: string, label: string}[] = [
    {value: 'admin', label: 'Administrador'},
    {value: 'supervisor', label: 'Supervisor'},
    {value: 'user', label: 'Usuario'}
  ];

  departamentos: string[] = ['Tecnología', 'Recursos Humanos', 'Finanzas', 'Marketing', 'Operaciones'];
  areas: string[] = ['Desarrollo', 'QA', 'Infraestructura', 'Diseño', 'Administración', 'Ventas', 'Atención al Cliente'];

  constructor(
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.isNew = data.isNew;
    this.userForm = this.fb.group({
      id: [data.user?.id || null],
      nombre: [data.user?.nombre || '', [Validators.required, Validators.minLength(2)]],
      apellido: [data.user?.apellido || '', [Validators.required, Validators.minLength(2)]],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      departamento: [data.user?.departamento || '', Validators.required],
      cargo: [data.user?.cargo || '', Validators.required],
      rol: [data.user?.rol || 'user', Validators.required],
      estado: [data.user?.estado !== undefined ? data.user.estado : true],
      area: [data.user?.area || '', Validators.required],
      fechaCreacion: [data.user?.fechaCreacion || new Date()]
    });
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
