import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-statistics-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="stats-container">
      <div class="stat-card total">
        <div class="stat-icon">
          <mat-icon>list_alt</mat-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statistics?.total || 0 }}</h3>
          <p>Total solicitudes</p>
        </div>
      </div>

      <div class="stat-card pending">
        <div class="stat-icon">
          <mat-icon>hourglass_empty</mat-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statistics?.pending || 0 }}</h3>
          <p>Pendientes</p>
        </div>
      </div>

      <div class="stat-card approved">
        <div class="stat-icon">
          <mat-icon>check_circle</mat-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statistics?.approved || 0 }}</h3>
          <p>Aprobadas</p>
        </div>
      </div>

      <div class="stat-card rejected">
        <div class="stat-icon">
          <mat-icon>cancel</mat-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statistics?.rejected || 0 }}</h3>
          <p>Rechazadas</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 20px;

      @media (min-width: 576px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 992px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      background-color: white;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
      }
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 16px;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    .stat-content {
      h3 {
        font-size: 28px;
        font-weight: 600;
        margin: 0 0 5px;
      }

      p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
    }

    .total .stat-icon {
      background-color: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }

    .pending .stat-icon {
      background-color: rgba(255, 152, 0, 0.1);
      color: #ff9800;
    }

    .approved .stat-icon {
      background-color: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    .rejected .stat-icon {
      background-color: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }
  `]
})
export class StatisticsCardsComponent {
  @Input() statistics: any;
}
