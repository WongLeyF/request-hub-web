import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {
  requestForm: FormGroup;
  requestTypes = [
    { value: 'purchase', viewValue: 'Solicitud de Compra' },
    { value: 'travel', viewValue: 'Solicitud de Viaje' },
    { value: 'leave', viewValue: 'Solicitud de Licencia' },
    { value: 'expense', viewValue: 'Reembolso de Gastos' },
    { value: 'other', viewValue: 'Otra Solicitud' }
  ];

  preSelectedType: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.requestForm = this.fb.group({
      type: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      dueDate: [null]
    });
  }

  ngOnInit(): void {
    // Verificar si hay un tipo de solicitud preseleccionado en la ruta
    this.route.params.subscribe(params => {
      const requestType = params['type'];
      if (requestType && this.requestTypes.some(type => type.value === requestType)) {
        this.preSelectedType = requestType;
        this.requestForm.get('type')?.setValue(requestType);
      }
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      console.log('Formulario enviado:', this.requestForm.value);

      // Aquí iría la lógica para enviar los datos al servicio
      this.snackBar.open('Solicitud enviada con éxito', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });

      // Redirigir a la lista de solicitudes
      this.router.navigate(['/requests']);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.markFormGroupTouched(this.requestForm);
    }
  }

  // Función para marcar todos los campos como tocados
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      // Si es un FormGroup recursivo
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    // Redirigir a la lista de solicitudes sin guardar cambios
    this.router.navigate(['/requests']);
  }

  // Getters para simplificar la validación en el template
  get typeControl() { return this.requestForm.get('type'); }
  get subjectControl() { return this.requestForm.get('subject'); }
  get descriptionControl() { return this.requestForm.get('description'); }
}
