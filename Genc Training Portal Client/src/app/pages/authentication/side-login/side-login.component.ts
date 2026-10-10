import { Component } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './side-login.component.html',
  styles: [`
    .guest-link {
      text-decoration: underline;
      color: #1976d2;
      cursor: pointer;
      font-weight: 600;
      display: inline-block;
      transition: all 0.3s ease;
      text-underline-offset: 2px;
    }

    .guest-link:hover {
      transform: translateY(-2px) scale(1.05);
      color: #2196f3;
      text-decoration-color: #2196f3;
      text-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
    }

    .guest-link:active {
      transform: translateY(0) scale(0.98);
      color: #0d47a1;
      text-decoration-color: #0d47a1;
      transition: all 0.1s ease;
    }
  `]
})
export class AppSideLoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private message: MatSnackBar) { }

    private role: string | null;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.loginForm.controls;
  }

  getRouteFromRole(role: string) : string {

    const routesMap = new Map<string, string>();
    routesMap.set("ROLE_ADMIN", "admin");
    routesMap.set("ROLE_ACADEMY_COORDINATOR", "academic-coordinator");
    routesMap.set("ROLE_TECHNICAL_TRAINER", "tech-trainer");
    routesMap.set("ROLE_BH_TRAINER", "bh-trainer");
    routesMap.set("ROLE_COACH", "coach");
    routesMap.set("ROLE_MENTOR", "mentor");
    routesMap.set("ROLE_CR", "cr");
    routesMap.set("ROLE_SKILLING_LEAD", "skilling-lead");
    routesMap.set("ROLE_GUEST", "admin"); // Guest users see admin dashboard but read-only
    return routesMap.get(role) || 'authentication';
  }

  /**
   * Handles guest login - provides read-only access to all admin features
   */
  onGuestLogin() {
    this.authService.guestLogin().subscribe({
      next: (response) => {
        StorageService.saveUser(response);
        this.role = StorageService.getUserPrimaryRole();

        if (this.role) {
          const routePath = this.getRouteFromRole(this.role);
          this.message.open('Welcome Guest! You have read-only access to all features.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.router.navigate([`/${routePath}`]);
        } else {
          this.message.open('Guest login failed.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['warn-snackbar']
          });
        }
      },
      error: (error) => {
        this.message.open('Guest login failed. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  submitForm() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (response) => {
          StorageService.saveUser(response);
          this.role = StorageService.getUserPrimaryRole();

          if (this.role) {
            const routePath = this.getRouteFromRole(this.role);
            this.router.navigate([`/${routePath}`]);
          } else {
            this.message.open('No role found for this user.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['warn-snackbar']
            });
          }

          this.message.open('Login successful!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'] // Optional: for custom styling
          });
          // this.router.navigate([`/${this.}`]).then(() => {
          //   // window.location.reload();
          // }
          // );
        },
        error: (error) => {
          this.message.open('Login failed. Please check your credentials.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'] // Optional: for custom styling
          });
        }
      });
    }
  }
}
