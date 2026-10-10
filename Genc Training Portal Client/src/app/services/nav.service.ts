// // import { Injectable } from '@angular/core';
// // import { Event, NavigationEnd, Router } from '@angular/router';
// // import { BehaviorSubject } from 'rxjs';

// // @Injectable({ providedIn: 'root' })
// // export class NavService {

// //     public currentUrl = new BehaviorSubject<any>(undefined);

// //     constructor(private router: Router) {
// //         this.router.events.subscribe((event: Event) => {
// //             if (event instanceof NavigationEnd) {
// //                 this.currentUrl.next(event.urlAfterRedirects);
// //             }
// //         });
// //     }


// // }

// // src/app/services/nav.service.ts
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { NavigationEnd, Router } from '@angular/router';
// import { RoleValue } from '../shared/constants/roles'; // Import your RoleValue enum/type

// @Injectable({
//   providedIn: 'root',
// })
// export class NavService {
//   // Use a BehaviorSubject to store and emit the current user's role
//   // Initialize with a default 'Guest' or 'Unknown' role until logged in
//   private _userRole: BehaviorSubject<RoleValue | null> = new BehaviorSubject<RoleValue | null>(null);
//   public currentUserRole$: Observable<RoleValue | null> = this._userRole.asObservable();

//   // Current Url
//   public currentUrl = new BehaviorSubject<string>('');

//   constructor(private router: Router) {
//     this.router.events.subscribe((event) => {
//       if (event instanceof NavigationEnd) {
//         this.currentUrl.next(event.urlAfterRedirects);
//       }
//     });

//     // --- IMPORTANT: Load role on app start ---
//     // This is crucial for handling page reloads or direct URL access
//     this.loadUserRoleFromStorage();
//   }

//   // Method to set the user's role after successful login
//   setUserRole(role: RoleValue | null) {
//     this._userRole.next(role);
//     if (role) {
//       localStorage.setItem('userRole', role); // Store in localStorage for persistence
//     } else {
//       localStorage.removeItem('userRole'); // Clear on logout
//     }
//   }

//   // Method to get the current role synchronously (for guards)
//   getCurrentUserRole(): RoleValue | null {
//     return this._userRole.getValue();
//   }

//   // Load role from local storage on service initialization (app boot)
//   private loadUserRoleFromStorage() {
//     const storedRole = localStorage.getItem('userRole') as RoleValue | null;
//     if (storedRole) {
//       this._userRole.next(storedRole);
//     }
//   }
// }


// src/app/services/nav.service.ts
// src/app/services/nav.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { NavItem } from '../models/interfaces/nav-item';
import { RoleValue } from '../shared/constants/roles';
import { StorageService } from './storage.service'; // Import StorageService

@Injectable({
  providedIn: 'root',
})
export class NavService {
  // BehaviorSubject to store and emit the current user's primary role
  private _userRole: BehaviorSubject<RoleValue | null> = new BehaviorSubject<RoleValue | null>(null);
  public currentUserRole$: Observable<RoleValue | null> = this._userRole.asObservable();

  // BehaviorSubject to store and emit the current navigation items for the sidebar
  private _currentNavItems: BehaviorSubject<NavItem[]> = new BehaviorSubject<NavItem[]>([]);
  public currentNavItems$: Observable<NavItem[]> = this._currentNavItems.asObservable();

  // BehaviorSubject to track the current URL
  public currentUrl = new BehaviorSubject<string>('');

  constructor(private router: Router, private storageService: StorageService) {
    // Subscribe to router events to update the current URL
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });

    // On service initialization, load the user's role from storage
    this.loadUserRoleFromStorage();
  }

  /**
   * Sets the current user's role in the service's state.
   * This method should be called by AuthService after login/logout.
   * It does NOT directly interact with localStorage; StorageService handles that.
   * @param role The RoleValue to set, or null for logged out.
   */
  setUserRole(role: RoleValue | null) {
    this._userRole.next(role);
    // If the user logs out (role is null), clear the displayed navigation items
    if (role === null) {
      this.setNavItems([]);
      console.log('NavService: setUserRole called with null role. Clearing nav items.');
    }
  }

  /**
   * Gets the current user's role synchronously from the service's state.
   * Useful for route guards or immediate checks.
   * @returns The current RoleValue or null.
   */
  getCurrentUserRole(): RoleValue | null {
    return this._userRole.getValue();
  }

  /**
   * Loads the user's role from localStorage using StorageService
   * and updates the service's internal state. Called on service init.
   */
  private loadUserRoleFromStorage() {
    const storedRole = StorageService.getUserPrimaryRole(); // Use StorageService to get the role
    console.log("NavService: Loaded role from storage:", storedRole); // For debugging
    this._userRole.next(storedRole);
  }

  /**
   * Sets the navigation items to be displayed in the sidebar.
   * This is typically called by the FullComponent based on route data.
   * @param items An array of NavItem objects.
   */
  setNavItems(items: NavItem[]) {
    this._currentNavItems.next(items);
    console.log('NavService: setNavItems called. New items:', items);
  }
}