import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { RequestTypeService } from '../../../services/request-type.service';
import { RequestType } from '../../../models/request-type.model';
import { RequestTypeFormComponent } from '../request-type-form/request-type-form.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-request-type-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './request-type-management.component.html',
  styleUrls: ['./request-type-management.component.scss']
})
export class RequestTypeManagementComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'descripcion', 'etapas', 'activo', 'acciones'];
  dataSource: MatTableDataSource<RequestType>;
  requestTypes: RequestType[] = [];
  filterForm: FormGroup;
  areas: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private requestTypeService: RequestTypeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<RequestType>([]);

    // Inicializar formulario de filtros
    this.filterForm = this.fb.group({
      searchTerm: [''],
      showInactive: [false]
    });
  }

  ngOnInit(): void {
    this.loadRequestTypes();
    this.loadAreas();

    // Suscribirse a cambios en el formulario de filtros
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRequestTypes(): void {
    this.requestTypeService.getRequestTypes().subscribe(types => {
      this.requestTypes = types;
      this.dataSource.data = types;
    });
  }

  loadAreas(): void {
    this.requestTypeService.getAreas().subscribe(areas => {
      this.areas = areas;
    });
  }

  applyFilters(): void {
    const filterValue = this.filterForm.value;

    let filteredData = this.requestTypes;

    // Filtrar por término de búsqueda
    if (filterValue.searchTerm) {
      const searchTerm = filterValue.searchTerm.toLowerCase();
      filteredData = filteredData.filter(type =>
        type.nombre.toLowerCase().includes(searchTerm) ||
        type.descripcion.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar tipos inactivos
    if (!filterValue.showInactive) {
      filteredData = filteredData.filter(type => type.activo);
    }

    this.dataSource.data = filteredData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters(): void {
    this.filterForm.reset({
      searchTerm: '',
      showInactive: false
    });
    this.applyFilters();
  }

  createRequestType(): void {
    const dialogRef = this.dialog.open(RequestTypeFormComponent, {
      width: '800px',
      data: { isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRequestTypes();
      }
    });
  }

  editRequestType(requestType: RequestType): void {
    // Primero cargar las etapas de aprobación
    this.requestTypeService.getApprovalStages(requestType.id!).subscribe(stages => {
      const requestTypeWithStages = {
        ...requestType,
        stages: stages
      };

      const dialogRef = this.dialog.open(RequestTypeFormComponent, {
        width: '800px',
        data: {
          requestType: requestTypeWithStages,
          isNew: false
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadRequestTypes();
        }
      });
    });
  }

  deleteRequestType(requestType: RequestType): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar tipo de solicitud',
        message: `¿Estás seguro de que deseas eliminar el tipo de solicitud "${requestType.nombre}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.requestTypeService.deleteRequestType(requestType.id!).subscribe(
          () => {
            this.requestTypes = this.requestTypes.filter(t => t.id !== requestType.id);
            this.dataSource.data = [...this.requestTypes];
            this.showSnackbar('Tipo de solicitud eliminado correctamente');
          },
          error => this.showSnackbar('Error al eliminar el tipo de solicitud')
        );
      }
    });
  }

  toggleRequestTypeStatus(requestType: RequestType): void {
    const updatedType = {
      ...requestType,
      activo: !requestType.activo
    };

    this.requestTypeService.updateRequestType(updatedType).subscribe(
      result => {
        const index = this.requestTypes.findIndex(t => t.id === result.id);
        if (index !== -1) {
          this.requestTypes[index] = result;
          this.dataSource.data = [...this.requestTypes];
        }
        this.showSnackbar(`Tipo de solicitud ${result.activo ? 'activado' : 'desactivado'} correctamente`);
      },
      error => this.showSnackbar('Error al actualizar estado del tipo de solicitud')
    );
  }

  getAreaName(areaId: number): string {
    const area = this.areas.find(a => a.id === areaId);
    return area ? area.nombre : '';
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000
    });
  }
}
