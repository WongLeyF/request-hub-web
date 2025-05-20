import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { RequestTypeService } from '../../../services/request-type.service';
import { RequestType, ApprovalStage, Area } from '../../../models/request-type.model';
import { MatCard, MatCardModule } from '@angular/material/card';

interface DialogData {
  requestType?: RequestType;
  isNew: boolean;
}

@Component({
  selector: 'app-request-type-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatStepperModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,
    DragDropModule,
    MatSnackBarModule
  ],
  templateUrl: './request-type-form.component.html',
  styleUrls: ['./request-type-form.component.scss']
})
export class RequestTypeFormComponent implements OnInit {
  requestTypeForm: FormGroup;
  isNew: boolean;
  areas: Area[] = [];
  roles: {value: string, label: string}[] = [
    {value: 'admin', label: 'Administrador'},
    {value: 'supervisor', label: 'Supervisor'}
  ];
  isLinear = false;

  constructor(
    private fb: FormBuilder,
    private requestTypeService: RequestTypeService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RequestTypeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isNew = data.isNew;
    this.requestTypeForm = this.fb.group({
      basicInfo: this.fb.group({
        id: [data.requestType?.id || null],
        nombre: [data.requestType?.nombre || '', [Validators.required, Validators.minLength(3)]],
        descripcion: [data.requestType?.descripcion || '', Validators.required],
        activo: [data.requestType?.activo !== undefined ? data.requestType.activo : true]
      }),
      approvalStages: this.fb.array([])
    });

    // Si estamos editando, cargar las etapas de aprobación
    if (data.requestType?.stages && data.requestType.stages.length > 0) {
      data.requestType.stages.forEach(stage => {
        this.addApprovalStage(stage);
      });
    }
  }

  ngOnInit(): void {
    // Cargar las áreas disponibles
    this.requestTypeService.getAreas().subscribe(areas => {
      this.areas = areas;
    });
  }

  get basicInfo(): FormGroup {
    return this.requestTypeForm.get('basicInfo') as FormGroup;
  }

  get approvalStages(): FormArray {
    return this.requestTypeForm.get('approvalStages') as FormArray;
  }

  addApprovalStage(stage?: ApprovalStage): void {
    this.approvalStages.push(this.fb.group({
      id: [stage?.id || null],
      rol: [stage?.rol || '', Validators.required],
      area_id: [stage?.area_id || '', Validators.required],
      etapa: [stage?.etapa || this.approvalStages.length + 1]
    }));
  }

  removeApprovalStage(index: number): void {
    this.approvalStages.removeAt(index);
    // Actualizar el número de etapa para cada elemento restante
    for (let i = 0; i < this.approvalStages.length; i++) {
      this.approvalStages.at(i).get('etapa')?.setValue(i + 1);
    }
  }

  dropApprovalStage(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.approvalStages.controls, event.previousIndex, event.currentIndex);
    // Actualizar el número de etapa para cada elemento
    for (let i = 0; i < this.approvalStages.length; i++) {
      this.approvalStages.at(i).get('etapa')?.setValue(i + 1);
    }
  }

  getAreaName(areaId: number): string {
    const area = this.areas.find(a => a.id === areaId);
    return area ? area.nombre : 'Área no encontrada';
  }

  getRoleName(rolValue: string): string {
    const role = this.roles.find(r => r.value === rolValue);
    return role ? role.label : 'Rol no encontrado';
  }

  onSubmit(): void {
    if (this.requestTypeForm.valid) {
      const basicInfo = this.basicInfo.value;
      const stages = this.approvalStages.value;

      // Crear un objeto completo de tipo de solicitud
      const requestType: RequestType = {
        ...basicInfo,
        stages: stages
      };

      if (this.isNew) {
        this.requestTypeService.createRequestType(requestType).subscribe(
          newRequestType => {
            // Guardar las etapas de aprobación
            if (stages.length > 0) {
              const stagesWithTypeId = stages.map((stage: any) => ({
                ...stage,
                request_type_id: newRequestType.id
              }));

              this.requestTypeService.saveApprovalStages(newRequestType.id!, stagesWithTypeId).subscribe(
                () => {
                  this.showSnackbar('Tipo de solicitud creado correctamente');
                  this.dialogRef.close(true);
                },
                error => this.showSnackbar('Error al guardar las etapas de aprobación')
              );
            } else {
              this.showSnackbar('Tipo de solicitud creado correctamente');
              this.dialogRef.close(true);
            }
          },
          error => this.showSnackbar('Error al crear tipo de solicitud')
        );
      } else {
        this.requestTypeService.updateRequestType(requestType).subscribe(
          updatedRequestType => {
            // Guardar las etapas de aprobación
            if (stages.length > 0) {
              const stagesWithTypeId = stages.map((stage: any) => ({
                ...stage,
                request_type_id: updatedRequestType.id
              }));

              this.requestTypeService.saveApprovalStages(updatedRequestType.id!, stagesWithTypeId).subscribe(
                () => {
                  this.showSnackbar('Tipo de solicitud actualizado correctamente');
                  this.dialogRef.close(true);
                },
                error => this.showSnackbar('Error al guardar las etapas de aprobación')
              );
            } else {
              this.showSnackbar('Tipo de solicitud actualizado correctamente');
              this.dialogRef.close(true);
            }
          },
          error => this.showSnackbar('Error al actualizar tipo de solicitud')
        );
      }
    } else {
      this.requestTypeForm.markAllAsTouched();
      this.showSnackbar('Por favor completa todos los campos requeridos');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000
    });
  }
}
