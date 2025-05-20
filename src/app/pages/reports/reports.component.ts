import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReportsService } from '../../services/reports.service';
import { ReportChartComponent } from './components/report-chart/report-chart.component';
import { RequestsByStatusComponent } from './components/requests-by-status/requests-by-status.component';
import { RequestsByTypeComponent } from './components/requests-by-type/requests-by-type.component';
import { ApprovalTimelineComponent } from './components/approval-timeline/approval-timeline.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatTooltipModule,
    ReportChartComponent,
    RequestsByStatusComponent,
    RequestsByTypeComponent,
    ApprovalTimelineComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  filterForm: FormGroup;
  reportTypes = [
    { value: 'status', label: 'Solicitudes por Estado' },
    { value: 'type', label: 'Solicitudes por Tipo' },
    { value: 'approval-time', label: 'Tiempos de Aprobación' },
    { value: 'department', label: 'Solicitudes por Area' },
    { value: 'user', label: 'Solicitudes por Usuario' }
  ];

  timeRanges = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' },
    { value: 'year', label: 'Este año' },
    { value: 'custom', label: 'Personalizado' }
  ];

  departments = ['Todos', 'Tecnología', 'Recursos Humanos', 'Finanzas', 'Marketing', 'Operaciones'];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'subject', 'type', 'status', 'createdAt', 'completedAt', 'approvalTime', 'department'];

  selectedReport: string = 'status';
  showCustomDateRange: boolean = false;
  isGeneratingReport: boolean = false;
  reportGenerated: boolean = false;

  reportData: any = null;
  exportableData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<any>([]);

    this.filterForm = this.fb.group({
      reportType: ['status'],
      timeRange: ['30d'],
      startDate: [null],
      endDate: [null],
      department: ['Todos'],
      exportFormat: ['excel']
    });
  }

  ngOnInit(): void {
    // Escuchar cambios en los filtros
    this.filterForm.get('reportType')?.valueChanges.subscribe(value => {
      this.selectedReport = value;
    });

    this.filterForm.get('timeRange')?.valueChanges.subscribe(value => {
      this.showCustomDateRange = value === 'custom';
    });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  generateReport(): void {
    if (this.filterForm.valid) {
      this.isGeneratingReport = true;
      const filters = this.filterForm.value;

      this.reportsService.generateReport(filters).subscribe(
        data => {
          this.reportData = data;
          this.exportableData = data.details || [];
          this.dataSource.data = this.exportableData;
          this.reportGenerated = true;
          this.isGeneratingReport = false;
        },
        error => {
          console.error('Error generando reporte', error);
          this.snackBar.open('Error al generar reporte', 'Cerrar', { duration: 3000 });
          this.isGeneratingReport = false;
        }
      );
    }
  }

  exportReport(): void {
    const format = this.filterForm.get('exportFormat')?.value;

    if (this.reportData && format) {
      this.reportsService.exportReport(this.reportData, format).subscribe(
        () => {
          this.snackBar.open(`Reporte exportado en formato ${format.toUpperCase()}`, 'Cerrar', { duration: 3000 });
        },
        error => {
          console.error('Error exportando reporte', error);
          this.snackBar.open('Error al exportar reporte', 'Cerrar', { duration: 3000 });
        }
      );
    }
  }

  resetFilters(): void {
    this.filterForm.reset({
      reportType: 'status',
      timeRange: '30d',
      startDate: null,
      endDate: null,
      department: 'Todos',
      exportFormat: 'excel'
    });
    this.reportGenerated = false;
    this.dataSource.data = [];
  }

  getReportTitle(): string {
    const reportType = this.reportTypes.find(r => r.value === this.selectedReport);
    return reportType ? reportType.label : 'Reporte';
  }
}
