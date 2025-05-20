import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
// import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:8099/api/reports';

  constructor(private http: HttpClient) { }

  generateReport(filters: any): Observable<any> {
    // En un entorno real, esto se enviaría al backend
    // Por ahora, generamos datos de ejemplo
    return this.http.post(`${this.apiUrl}/generate`, filters).pipe(
      catchError(() => of(this.generateMockReport(filters)))
    );
  }

  exportReport(reportData: any, format: string): Observable<boolean> {
    // En un entorno real, esto se enviaría al backend para generar el archivo
    // Por ahora, simulamos una descarga
    return this.http.post(`${this.apiUrl}/export`, { data: reportData, format }, { responseType: 'blob' }).pipe(
      map(blob => {
        const fileName = `reporte_${new Date().getTime()}.${format}`;
        // saveAs(blob, fileName);
        return true;
      }),
      catchError(() => {
        // Simulación de descarga con datos de ejemplo
        const content = this.generateMockExport(reportData, format);
        const blob = new Blob([content], { type: this.getMimeType(format) });
        const fileName = `reporte_${new Date().getTime()}.${format}`;
        // saveAs(blob, fileName);
        return of(true);
      })
    );
  }

  private getMimeType(format: string): string {
    switch (format.toLowerCase()) {
      case 'excel': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'pdf': return 'application/pdf';
      case 'csv': return 'text/csv';
      default: return 'application/octet-stream';
    }
  }

  private generateMockReport(filters: any): any {
    const reportType = filters.reportType;
    const baseData = this.getMockData();

    let chartData: any = null;

    switch (reportType) {
      case 'status':
        chartData = {
          labels: ['Pendientes', 'Aprobadas', 'Rechazadas', 'Canceladas'],
          datasets: [{
            label: 'Solicitudes por Estado',
            data: [12, 19, 5, 3],
            backgroundColor: ['#FF9800', '#4CAF50', '#F44336', '#9E9E9E'],
            borderWidth: 1
          }]
        };
        break;

      case 'type':
        chartData = {
          labels: ['Compras', 'Viajes', 'Reembolsos', 'Recursos', 'Otros'],
          datasets: [{
            data: [8, 12, 15, 5, 2],
            backgroundColor: ['#3F51B5', '#2196F3', '#00BCD4', '#009688', '#4CAF50'],
            borderWidth: 1
          }]
        };
        break;

      case 'approval-time':
        chartData = {
          labels: ['Compras', 'Viajes', 'Reembolsos', 'Recursos', 'Otros'],
          datasets: [{
            label: 'Tiempo promedio (días)',
            data: [3.2, 4.8, 1.5, 6.2, 2.7],
            backgroundColor: '#3F51B5',
            borderColor: '#3F51B5',
            borderWidth: 2,
            fill: false,
            tension: 0.4
          }]
        };
        break;

      case 'department':
        chartData = {
          labels: ['Tecnología', 'RRHH', 'Finanzas', 'Marketing', 'Operaciones'],
          datasets: [{
            label: 'Solicitudes',
            data: [25, 12, 18, 8, 15],
            backgroundColor: '#2196F3'
          }]
        };
        break;

      case 'user':
        chartData = {
          labels: ['Ana García', 'Juan López', 'María Rodríguez', 'Carlos Sánchez', 'Laura Martínez'],
          datasets: [{
            label: 'Solicitudes',
            data: [8, 5, 12, 3, 7],
            backgroundColor: '#9C27B0'
          }]
        };
        break;
    }

    return {
      chartData,
      summary: {
        total: 42,
        average: 3.5,
        min: 0.5,
        max: 12
      },
      details: baseData
    };
  }

  private getMockData(): any[] {
    return [
      {
        id: 'REQ-2025-001',
        subject: 'Compra de material de oficina',
        type: 'Compra',
        status: 'approved',
        createdAt: '2025-04-10',
        completedAt: '2025-04-15',
        approvalTime: 5,
        department: 'Finanzas'
      },
      {
        id: 'REQ-2025-002',
        subject: 'Viaje a conferencia tech',
        type: 'Viaje',
        status: 'approved',
        createdAt: '2025-03-22',
        completedAt: '2025-03-28',
        approvalTime: 6,
        department: 'Tecnología'
      },
      {
        id: 'REQ-2025-003',
        subject: 'Reembolso gastos representación',
        type: 'Reembolso',
        status: 'rejected',
        createdAt: '2025-04-05',
        completedAt: '2025-04-08',
        approvalTime: 3,
        department: 'Marketing'
      },
      {
        id: 'REQ-2025-004',
        subject: 'Contratación personal temporal',
        type: 'Recursos',
        status: 'pending',
        createdAt: '2025-04-18',
        completedAt: null,
        approvalTime: null,
        department: 'RRHH'
      },
      {
        id: 'REQ-2025-005',
        subject: 'Adquisición equipos informáticos',
        type: 'Compra',
        status: 'approved',
        createdAt: '2025-03-15',
        completedAt: '2025-03-20',
        approvalTime: 5,
        department: 'Tecnología'
      }
    ];
  }

  private generateMockExport(reportData: any, format: string): string {
    // Simulación simple de contenido exportado
    if (format === 'csv') {
      let csv = 'ID,Asunto,Tipo,Estado,Fecha Creación,Fecha Finalización,Tiempo Aprobación,Departamento\n';
      reportData.details.forEach((item: any) => {
        csv += `${item.id},${item.subject},${item.type},${item.status},${item.createdAt},${item.completedAt || ''},${item.approvalTime || ''},${item.department}\n`;
      });
      return csv;
    }

    // Para otros formatos devolvemos contenido simple
    return JSON.stringify(reportData.details, null, 2);
  }
}
