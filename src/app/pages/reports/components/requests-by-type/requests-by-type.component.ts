import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-requests-by-type',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatCardModule],
  template: `
    <div class="report-container">
      <div class="chart-area">
        <canvas baseChart
          [data]="chartData"
          [type]="chartType"
          [options]="chartOptions"
          [plugins]="chartPlugins">
        </canvas>
      </div>

      <div class="stats-area" *ngIf="data">
        <div class="stats-cards">
          <mat-card class="stats-card">
            <div class="card-content">
              <div class="stat-value">{{ getTotalRequests() }}</div>
              <div class="stat-label">Total de Solicitudes</div>
            </div>
          </mat-card>

          <mat-card class="stats-card">
            <div class="card-content">
              <div class="stat-value">{{ getMostCommonType() }}</div>
              <div class="stat-label">Tipo más común</div>
            </div>
          </mat-card>

          <mat-card class="stats-card">
            <div class="card-content">
              <div class="stat-value">{{ getTypePercentage() }}%</div>
              <div class="stat-label">% del tipo principal</div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .report-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .chart-area {
      flex: 1;
      min-width: 300px;
      height: 300px;
      position: relative;
    }

    .stats-area {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stats-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .stats-card {
      flex: 1;
      min-width: 120px;
      padding: 16px;
      text-align: center;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 8px;
      color: #3f51b5;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
    }

    @media (max-width: 768px) {
      .chart-area, .stats-area {
        flex: 0 0 100%;
      }
    }
  `]
})
export class RequestsByTypeComponent implements OnChanges {
  @Input() data: any;

  chartType: ChartType = 'pie';

  chartData: ChartData = {
    labels: [],
    datasets: []
  };

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15
        }
      }
    }
  };

  chartPlugins = [];

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

  getTotalRequests(): number {
    if (!this.data || !this.data.datasets || !this.data.datasets[0]) {
      return 0;
    }

    return this.data.datasets[0].data.reduce((sum: number, value: number) => sum + value, 0);
  }

  getMostCommonType(): string {
    if (!this.data || !this.data.labels || !this.data.datasets || !this.data.datasets[0]) {
      return 'N/A';
    }

    const maxIndex = this.data.datasets[0].data.indexOf(
      Math.max(...this.data.datasets[0].data)
    );

    return maxIndex !== -1 ? this.data.labels[maxIndex] : 'N/A';
  }

  getTypePercentage(): number {
    if (!this.data || !this.data.datasets || !this.data.datasets[0]) {
      return 0;
    }

    const maxValue = Math.max(...this.data.datasets[0].data);
    const total = this.getTotalRequests();

    if (total === 0) return 0;

    return Math.round((maxValue / total) * 100);
  }
}
