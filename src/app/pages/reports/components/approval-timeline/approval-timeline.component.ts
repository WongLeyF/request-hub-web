import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-approval-timeline',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatCardModule, MatButtonToggleModule],
  template: `
    <div class="timeline-container">
      <div class="controls">
        <mat-button-toggle-group [(value)]="viewMode" aria-label="View Mode">
          <mat-button-toggle value="average">Promedio</mat-button-toggle>
          <mat-button-toggle value="total">Total</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <div class="chart-container">
        <canvas baseChart
          [data]="chartData"
          [options]="chartOptions"
          [type]="chartType">
        </canvas>
      </div>

      <div class="stats-container" *ngIf="data">
        <mat-card class="stat-card">
          <div class="stat-value">{{ getMinApprovalTime() | number:'1.1-1' }} días</div>
          <div class="stat-label">Tiempo mínimo</div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-value">{{ getAverageApprovalTime() | number:'1.1-1' }} días</div>
          <div class="stat-label">Tiempo promedio</div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-value">{{ getMaxApprovalTime() | number:'1.1-1' }} días</div>
          <div class="stat-label">Tiempo máximo</div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .timeline-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    .controls {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }

    .chart-container {
      position: relative;
      height: 280px;
      margin-bottom: 20px;
    }

    .stats-container {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-top: 10px;
    }

    .stat-card {
      flex: 1;
      padding: 16px;
      text-align: center;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-value {
      font-size: 24px;
      font-weight: 500;
      color: #3f51b5;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
    }
  `]
})
export class ApprovalTimelineComponent implements OnChanges {
  @Input() data: any;

  viewMode: 'average' | 'total' = 'average';
  chartType: ChartType = 'line';

  chartData: ChartData = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Días para aprobación'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tipos de solicitud'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toFixed(1)} días`;
          }
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.data) return;

    this.chartData = {
      labels: this.data.labels || [],
      datasets: this.data.datasets || []
    };
  }

  getMinApprovalTime(): number {
    if (!this.data || !this.data.datasets || !this.data.datasets[0]) {
      return 0;
    }

    return Math.min(...this.data.datasets[0].data);
  }

  getMaxApprovalTime(): number {
    if (!this.data || !this.data.datasets || !this.data.datasets[0]) {
      return 0;
    }

    return Math.max(...this.data.datasets[0].data);
  }

  getAverageApprovalTime(): number {
    if (!this.data || !this.data.datasets || !this.data.datasets[0]) {
      return 0;
    }

    const values = this.data.datasets[0].data;
    const sum = values.reduce((total: number, value: number) => total + value, 0);
    return values.length ? sum / values.length : 0;
  }
}
