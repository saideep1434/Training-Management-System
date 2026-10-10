// src/app/pages/unauthorized/unauthorized.component.ts (create this file)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for standalone components

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h1>403 - Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <a routerLink="/dashboard">Go to Dashboard</a>
    </div>
  `,
  styles: []
})
export class UnauthorizedComponent { }