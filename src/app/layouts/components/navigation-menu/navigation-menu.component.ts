import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatBadgeModule
  ],
  template: `
    <div class="navigation-menu">
      <mat-nav-list>
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>

        <a mat-list-item routerLink="/requests" routerLinkActive="active-link">
          <mat-icon matListItemIcon>list_alt</mat-icon>
          <span matListItemTitle>Mis Solicitudes</span>
        </a>

        <mat-expansion-panel class="mat-elevation-z0">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon >add_circle_outline</mat-icon>
              <span class="ms-3">Crear Solicitud</span>
            </mat-panel-title>
          </mat-expansion-panel-header>

          <mat-nav-list dense>
            <a mat-list-item routerLink="/requests/new/purchase">
              <mat-icon matListItemIcon>shopping_cart</mat-icon>
              <span matListItemTitle>Compra</span>
            </a>

            <a mat-list-item routerLink="/requests/new/travel">
              <mat-icon matListItemIcon>flight</mat-icon>
              <span matListItemTitle>Viaje</span>
            </a>

            <a mat-list-item routerLink="/requests/new/expense">
              <mat-icon matListItemIcon>receipt</mat-icon>
              <span matListItemTitle>Reembolso</span>
            </a>
          </mat-nav-list>
        </mat-expansion-panel>

        <a mat-list-item routerLink="/approvals" routerLinkActive="active-link">
          <mat-icon matListItemIcon>fact_check</mat-icon>
          <span matListItemTitle>Aprobaciones</span>
        </a>

        <a mat-list-item routerLink="/reports" routerLinkActive="active-link">
          <mat-icon matListItemIcon>bar_chart</mat-icon>
          <span matListItemTitle>Reportes</span>
        </a>

        <mat-divider></mat-divider>

        <a mat-list-item routerLink="/settings" routerLinkActive="active-link">
          <mat-icon matListItemIcon>settings</mat-icon>
          <span matListItemTitle>Configuración</span>
        </a>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .navigation-menu {
      padding: 16px 0;
    }

    .mat-mdc-list-item {
      border-radius: 0 24px 24px 0;
      margin: 4px 8px 4px 0;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
    }

    .active-link {
      background-color: rgba(63, 81, 181, 0.1) !important;
      color: #3f51b5 !important;

      .mat-icon {
        color: #3f51b5 !important;
      }
    }

    .mat-expansion-panel {
      background-color: transparent;
      box-shadow: none;
    }

    .mat-expansion-panel-header {
      padding: 0 16px;
    }

    .mat-panel-title {
      display: flex;
      align-items: center;

      .mat-icon {
        margin-right: 16px;
      }
    }

    mat-nav-list.dense {
      padding-left: 16px;
    }
  `]
})
export class NavigationMenuComponent {}
