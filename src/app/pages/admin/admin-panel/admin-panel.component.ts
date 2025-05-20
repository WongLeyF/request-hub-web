import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { UserManagementComponent } from '../user-management/user-management.component';
import { RequestTypeManagementComponent } from '../request-type-management/request-type-management.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    UserManagementComponent,
    RequestTypeManagementComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  activeTabIndex = 0;

  constructor() { }

  onTabChanged(event: any): void {
    this.activeTabIndex = event.index;
  }
}
