import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-requests-chart',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="chartData"
        [options]="chartOptions"
        [type]="'line'">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 300px;
      width: 100%;
    }
  `]
})
export class RequestsChartComponent implements OnInit {
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  ngOnInit(): void {
    this.generateChartData();
  }

  generateChartData(): void {
    // En una aplicación real, estos datos vendrían de un servicio
    const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];

    this.chartData = {
      labels: labels,
      datasets: [
        {
          data: [12, 19, 13, 15, 22, 25],
          label: 'Total',
          backgroundColor: 'rgba(63, 81, 181, 0.2)',
          borderColor: '#3f51b5',
          pointBackgroundColor: '#3f51b5',
          fill: true,
          tension: 0.2
        },
        {
          data: [5, 10, 8, 7, 12, 15],
          label: 'Aprobadas',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4caf50',
          pointBackgroundColor: '#4caf50',
          fill: true,
          tension: 0.2
        },
        {
          data: [3, 5, 2, 4, 5, 6],
          label: 'Rechazadas',
          backgroundColor: 'rgba(244, 67, 54, 0.2)',
          borderColor: '#f44336',
          pointBackgroundColor: '#f44336',
          fill: true,
          tension: 0.2
        }
      ]
    };
  }
}
