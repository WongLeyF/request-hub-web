import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-requests-by-status',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="chartData"
        [type]="chartType"
        [options]="chartOptions"
        [plugins]="chartPlugins">
      </canvas>
    </div>
    <div class="status-legend" *ngIf="data">
      <div class="legend-item" *ngFor="let label of data.labels; let i = index">
        <div class="color-box" [style.backgroundColor]="getColor(i)"></div>
        <div class="label-container">
          <span class="label">{{ label }}</span>
          <span class="value">{{ data.datasets[0].data[i] }} solicitudes</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 280px;
      position: relative;
      margin: auto;
      width: 100%;
    }

    .status-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      margin-top: 24px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      min-width: 160px;
    }

    .color-box {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      margin-right: 12px;
    }

    .label-container {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-weight: 500;
      font-size: 14px;
    }

    .value {
      font-size: 12px;
      color: #666;
    }
  `]
})
export class RequestsByStatusComponent implements OnChanges {
  @Input() data: any;

  chartType: ChartType = 'doughnut';

  chartData: ChartData = {
    labels: [],
    datasets: []
  };

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
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

  getColor(index: number): string {
    if (!this.data || !this.data.datasets || !this.data.datasets[0] || !this.data.datasets[0].backgroundColor) {
      return '#ccc';
    }

    const colors = this.data.datasets[0].backgroundColor;
    return Array.isArray(colors) ? colors[index] : colors;
  }
}
