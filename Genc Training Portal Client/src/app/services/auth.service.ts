// // src/app/services/auth.service.ts

// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { StorageService } from './storage.service';
// import { Router } from '@angular/router';

// // Define your user profile types in CAPITAL letters, excluding MANAGER and EMPLOYEE
// export type UserProfile =
//   | 'SKILLING_LEAD'
//   | 'ROLE_ACADEMY_COORDINATOR'
//   | 'TECH_TRAINER'
//   | 'COACH'
//   | 'BH_TRAINER'
//   | 'MENTOR'
//   | 'CR'
//   | 'ROLE_ADMIN'
//   | 'ROLE_ACADEMY';

// // Adjust LoginResponse to match your provided JSON structure (userRole will still come as is from backend)
// export interface LoginResponse {
//   success: string;
//   message: string;
//   username : string;
//   roles : string[];
//   jwtToken: string
//    // Directly at the top level, will be mapped/used as capitalized
//   // Any other properties your backend sends
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   baseUrl = 'http://localhost:8083/auth';

//   constructor(private http: HttpClient, private router: Router) { }

//   login(username: string | any, password: string | any): Observable<LoginResponse> {
//     return this.http.post<LoginResponse>(this.baseUrl + '/login', {username, password}).pipe(
//       tap((response: LoginResponse) => {
//         console.log("response received" , response);
//         console.log('ROLES RECEIVED', response.roles);
//         // IMPORTANT: If your backend sends non-capitalized roles (e.g., "Skilling lead"),
//         // and you want to store "SKILLING_LEAD", you'll need a mapping function here.
//         // Otherwise, ensure your backend sends the capitalized roles directly.
//         StorageService.saveUser(response);
//       })
//     );
//   }

//   isLoggedIn(): boolean {
//     // This now correctly checks if the full user object is stored
//     return StorageService.getUser() !== null;
//   }

//   logout(): void {
//     StorageService.signOut();
//     this.router.navigate(['/authentication/login']);
//   }

//   // FIX: hasRole should check if the roles array includes the required role
//   hasRole(requiredRole: UserProfile): boolean {
//     const user = StorageService.getUser();
//     if(user == null){
//       this.logout();
//       throw new Error("User is not logged in");

//     }
//     // Check if user exists and their roles array includes the requiredRole
//     return user && user.roles && user.roles.includes(requiredRole);
//   }

//   // FIX: hasAnyRole is good, but user needs to be LoginResponse type
//   hasAnyRole(requiredRoles: UserProfile[]): boolean {
//     const user = StorageService.getUser(); // user is now LoginResponse | null
//     if (!user || !user.roles) {
//       return false; // No user or no roles array
//     }
//     // Check if any of the user's roles are in the requiredRoles list
//     return requiredRoles.some(role => user.roles.includes(role));
//   }


//   // FIX: getCurrentUser now returns the full LoginResponse object from StorageService
//   getCurrentUser(): LoginResponse | null {
//     return StorageService.getUser();
//   }
// }


// src/app/services/auth.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { StorageService } from './storage.service'; // Import LoginResponse from StorageService
import { NavService } from './nav.service'; // Import NavService
import { RoleValue, ROLES } from '../shared/constants/roles'; // Import RoleValue and ROLES

// Define your login request payload interface
export interface LoginRequest {
  username: string;
  password: string;
}

export type UserProfile =
  | 'ROLE_SKILLING_LEAD'
  | 'ROLE_ACADEMY_COORDINATOR'
  | 'ROLE_TECHNICAL_TRAINER'
  | 'ROLE_COACH'
  | 'ROLE_BH_TRAINER'
  | 'ROLE_MENTOR'
  | 'ROLE_CR'
  | 'ROLE_ADMIN'
  | 'ROLE_GUEST'

export interface LoginResponse {
    success: string;
    message: string;
    username : string;
    roles : string[];
    jwtToken: string;
  associateId?: string; // add optional associateId from backend

     // Directly at the top level, will be mapped/used as capitalized
    // Any other properties your backend sends
  }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = `${environment.apiBaseUrl.replace('/api', '')}/auth`; // Use environment configuration

  constructor(
    private http: HttpClient,
    private router: Router,
    private navService: NavService, // Inject NavService
  ) { }

  /**
   * Handles user login.
   * @param username The user's username.
   * @param password The user's password.
   * @returns An Observable of LoginResponse.
   */
  login(username: string | any, password: string|any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + '/login', { username, password }).pipe(
      tap((response: LoginResponse) => {
        // Save the entire user response (including JWT and roles) to localStorage via StorageService
        StorageService.saveUser(response);

        // Optional: also store associateId in a dedicated key if other parts of app read it directly
        if (response.associateId) {
          window.localStorage.setItem('associateId', response.associateId);
        }

        // 2. Inform NavService about the user's primary role
        // This will update the NavService's BehaviorSubject and trigger sidebar filtering
        if (response.roles && response.roles.length > 0) {
          this.navService.setUserRole(response.roles[0] as RoleValue);
        } else {
          this.navService.setUserRole(null); // No roles, treat as unauthenticated for nav purposes
        }

      })
    );
  }

  /**
   * Handles guest login.
   * Guest users get read-only access to all admin features.
   * @returns An Observable of LoginResponse.
   */
  guestLogin(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + '/guest-login', {}).pipe(
      tap((response: LoginResponse) => {
        // Save guest user data to localStorage
        StorageService.saveUser(response);

        // Set associateId for guest
        if (response.associateId) {
          window.localStorage.setItem('associateId', response.associateId);
        }

        // Inform NavService about guest role
        if (response.roles && response.roles.length > 0) {
          this.navService.setUserRole(response.roles[0] as RoleValue);
        }
      })
    );
  }

  /**
   * Checks if a user is currently logged in.
   * @returns True if a token exists in StorageService, false otherwise.
   */
  isLoggedIn(): boolean {
    return StorageService.getToken() !== null;
  }

  /**
   * Handles user logout.
   * Clears session data and redirects to login page.
   */
  logout(): void {
    // 1. Clear user data from localStorage via StorageService
    StorageService.signOut();

    // 2. Inform NavService that the user is no longer logged in
    // This will clear the role state and hide role-specific nav items
    this.navService.setUserRole(null);

    // 3. Redirect to the login page
    this.router.navigate(['/authentication/login']); // **IMPORTANT: Adjust your login route**
  }

  /**
   * Checks if the currently logged-in user has a specific role.
   * @param requiredRole The RoleValue to check for.
   * @returns True if the user has the role, false otherwise.
   */
  hasRole(requiredRole: RoleValue): boolean { // Changed type to RoleValue
    // This method now directly uses StorageService's hasRole
    return StorageService.hasRole(requiredRole);
  }

  /**
   * Checks if the currently logged-in user has any of the specified roles.
   * @param requiredRoles An array of RoleValue to check against.
   * @returns True if the user has at least one of the roles, false otherwise.
   */
  hasAnyRole(requiredRoles: RoleValue[]): boolean { // Changed type to RoleValue[]
    // This method now directly uses StorageService's hasAnyRole
    return StorageService.hasAnyRole(requiredRoles);
  }

  /**
   * Gets the full LoginResponse object for the current user.
   * @returns LoginResponse object or null if not logged in.
   */
  getCurrentUser(): LoginResponse | null {
    return StorageService.getUser();
  }
}
