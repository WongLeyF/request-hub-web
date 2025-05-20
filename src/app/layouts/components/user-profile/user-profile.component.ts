import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="user-profile">
      <div class="avatar-container">
        <div class="avatar" [style.background-image]="'url(' + (user?.avatarUrl || 'assets/images/avatar-placeholder.png') + ')'"></div>
      </div>
      <h3 class="user-name">{{ user?.username }}</h3>
      <p class="user-area">{{ user?.area }}</p>
      <p class="user-email">{{ user?.email }}</p>
    </div>
  `,
  styles: [`
    .user-profile {
      padding: 24px 16px;
      text-align: center;
      border-bottom: 1px solid #eee;
    }

    .avatar-container {
      margin: 0 auto 16px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #f0f0f0;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .avatar {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
    }

    .user-name {
      font-size: 20px;
      font-weight: 500;
      margin: 0 0 4px;
    }

    .user-role {
      color: #4a90e2;
      font-weight: 500;
      margin: 0 0 4px;
    }

    .user-department {
      color: #666;
      margin: 0 0 16px;
      font-size: 14px;
    }

    .profile-button {
      width: 100%;
    }
  `]
})
export class UserProfileComponent {
  @Input() user: any;
}
