import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { StatisticsCardsComponent } from './components/statistics-cards/statistics-cards.component';
import { ActivityFeedComponent } from './components/activity-feed/activity-feed.component';
import { RequestsChartComponent } from './components/requests-chart/requests-chart.component';
import { RequestService } from '../../services/request.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    StatisticsCardsComponent,
    ActivityFeedComponent,
    RequestsChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  user: any;
  statistics: any;
  activities: any[] = [];

  constructor(
    private requestService: RequestService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadStatistics();
    this.loadActivities();
  }

  loadUserInfo(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  loadStatistics(): void {
    this.requestService.getRequestsStatistics().subscribe((stats) => {
      this.statistics = stats;
    });
  }

  loadActivities(): void {
    this.requestService.getRecentActivities().subscribe((activities) => {
      this.activities = activities;
    });
  }
}
