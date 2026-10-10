// src/app/pages/error/error.component.ts (create this file)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for standalone components

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a routerLink="/dashboard">Go to Dashboard</a>
    </div>
  `,
  styles: []
})
export class ErrorComponent { }