import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-report-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-wrapper">
      <div class="chart-header" *ngIf="title">
        <h3>{{ title }}</h3>
      </div>

      <div class="chart-container">
        <canvas baseChart
          [data]="chartData"
          [type]="resolvedChartType"
          [options]="chartOptions">
        </canvas>
      </div>

      <div class="chart-footer" *ngIf="showFooter">
        <p class="note">{{ footerText }}</p>
      </div>
    </div>
  `,
  styles: [`
    .chart-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .chart-header {
      margin-bottom: 16px;
      text-align: center;

      h3 {
        font-size: 18px;
        font-weight: 500;
        color: #333;
        margin: 0;
      }
    }

    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }

    .chart-footer {
      text-align: center;
      margin-top: 12px;

      .note {
        font-size: 12px;
        color: #666;
        font-style: italic;
        margin: 0;
      }
    }
  `]
})
export class ReportChartComponent implements OnChanges {
  @Input() data: any;
  @Input() chartType: string = 'bar';
  @Input() title: string = '';
  @Input() footerText: string = 'Los datos mostrados son del período seleccionado en los filtros.';

  showFooter: boolean = true;

  // Definir el tipo de gráfico real basado en el input
  get resolvedChartType(): ChartType {
    switch (this.chartType) {
      case 'department':
      case 'user':
        return 'bar';
      case 'approval-time':
        return 'line';
      case 'type':
        return 'doughnut';
      case 'status':
        return 'pie';
      default:
        return 'bar';
    }
  }

  chartData: ChartData = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChart();
    }

    if (changes['chartType']) {
      this.updateChartOptions();
    }
  }

  private updateChart(): void {
    if (!this.data) return;

    this.chartData = {
      labels: this.data.labels || [],
      datasets: this.data.datasets || []
    };
  }

  private updateChartOptions(): void {
    // Ajustar opciones específicas según el tipo de gráfico
    switch (this.chartType) {
      case 'bar':
      case 'department':
      case 'user':
        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        };
        break;

      case 'line':
      case 'approval-time':
        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          elements: {
            line: {
              tension: 0.4
            },
            point: {
              radius: 4,
              hitRadius: 10,
              hoverRadius: 6
            }
          }
        };
        break;

      case 'pie':
      case 'doughnut':
      case 'status':
      case 'type':
        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        };
        break;
    }
  }
}
