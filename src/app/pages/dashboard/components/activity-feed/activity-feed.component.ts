import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="activity-feed">
      <div *ngIf="activities?.length === 0" class="no-activities">
        <mat-icon>history</mat-icon>
        <p>No hay actividades recientes</p>
      </div>

      <div *ngFor="let activity of activities; let last = last" class="activity-item">
        <div class="activity-icon" [ngClass]="getActivityIconClass(activity.type)">
          <mat-icon>{{ getActivityIcon(activity.type) }}</mat-icon>
        </div>

        <div class="activity-content">
          <div class="activity-header">
            <span class="activity-user">{{ activity.user }}</span>
            <span class="activity-time">{{ activity.timestamp | date:'shortTime' }}</span>
          </div>

          <p class="activity-message">{{ activity.message }}</p>

          <div *ngIf="activity.requestId" class="activity-meta">
            <mat-chip-set>
              <mat-chip>ID: {{ activity.requestId }}</mat-chip>
              <mat-chip [color]="getStatusColor(activity.status)" selected>{{ activity.status }}</mat-chip>
            </mat-chip-set>
          </div>
        </div>

        <mat-divider *ngIf="!last"></mat-divider>
      </div>
    </div>
  `,
  styles: [`
    .activity-feed {
      height: 100%;
    }

    .no-activities {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px;
      color: #999;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
    }

    .activity-item {
      display: flex;
      padding: 16px 0;
    }

    .activity-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 16px;
      flex-shrink: 0;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      &.created {
        background-color: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      }

      &.updated {
        background-color: rgba(33, 150, 243, 0.1);
        color: #2196f3;
      }

      &.approved {
        background-color: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      }

      &.rejected {
        background-color: rgba(244, 67, 54, 0.1);
        color: #f44336;
      }

      &.commented {
        background-color: rgba(156, 39, 176, 0.1);
        color: #9c27b0;
      }
    }

    .activity-content {
      flex: 1;
    }

    .activity-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .activity-user {
      font-weight: 500;
    }

    .activity-time {
      color: #999;
      font-size: 12px;
    }

    .activity-message {
      margin: 0 0 8px;
      color: #333;
    }

    .activity-meta {
      margin-top: 8px;
    }

    mat-divider {
      margin: 8px 0;
    }
  `]
})
export class ActivityFeedComponent {
  @Input() activities: any[] = [];

  getActivityIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'created': 'add_circle',
      'updated': 'edit',
      'approved': 'check_circle',
      'rejected': 'cancel',
      'commented': 'chat'
    };

    return icons[type] || 'history';
  }

  getActivityIconClass(type: string): string {
    return type || 'updated';
  }

  getStatusColor(status: string): string {
    const colors: {[key: string]: string} = {
      'aprobada': 'primary',
      'rechazada': 'warn',
      'pendiente': 'accent'
    };

    return colors[status.toLowerCase()] || 'primary';
  }
}
