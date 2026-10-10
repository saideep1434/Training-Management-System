// // src/app/services/storage.service.ts

// import { Injectable } from '@angular/core';
// import { LoginResponse } from './auth.service';

// const USER = "attendance_user";
// @Injectable({
//   providedIn: 'root'
// })
// export class StorageService {

//   constructor() { }

//   static saveUser(user: any): void {
//     window.localStorage.removeItem(USER);
//     window.localStorage.setItem(USER, JSON.stringify(user));
//   }

//   static getUser(): LoginResponse | null { // Changed return type for clarity
//     const user = window.localStorage.getItem(USER);
//     if (!user) {
//       return null;
//     }

//     try {
//       const userObject: LoginResponse = JSON.parse(user);
//       return userObject;
//     } catch (error) {
//       console.error("Error parsing user data from localStorage:", error);
//       return null;
//     }
//   }

//   static getUserId(): string | null {
//     const user = StorageService.getUser();
//     return user ? user.username : null; // Assuming username is the ID here, or change to user.id if your LoginResponse has 'id'
//   }

//   static getToken() : string | null {
//     const user = StorageService.getUser();
//     return user ? user.jwtToken : null;
//   }

//   // FIX: Access the 'roles' array from the user object and get the first role
//   static getUserRole(): string | null {
//     const user = StorageService.getUser();
//     // Ensure user exists and has roles, then return the first role
//     return user && user.roles && user.roles.length > 0 ? user.roles[0] : null;
//   }

//   // --- Role-specific login checks (now using CAPITALIZED role names) ---
//   // These will now correctly access user.roles[0] === 'ADMIN' etc.
//   // Example for isAdminLoggedIn:
//   static isAdminLoggedIn(): boolean {
//     const user = StorageService.getUser();
//     if(user == null){
//       return false;
//     }
//     return user && user.roles && user.roles.includes('ADMIN'); // Use .includes for array
//   }
//   // Apply similar changes to other isXxxLoggedIn methods as they should check the roles array

//   static isSkillingLeadLoggedIn(): boolean {
//     const user = StorageService.getUser();
//     if(user == null){
//       return false;
//     }
//     return user && user.roles && user.roles.includes('SKILLING_LEAD');
//   }

//   static isAcademicCoordinatorLoggedIn(): boolean {
//     const user = StorageService.getUser();
//     if(user == null){
//       return false;
//     }
//     return user && user.roles && user.roles.includes('ACADEMIC_COORDINATOR');
//   }

//   static isTechTrainerLoggedIn(): boolean {
//     const user = StorageService.getUser();
//     if(user == null){
//       return false;
//     }
//     return user && user.roles && user.roles.includes('TECH_TRAINER');
//   }

//   static isCoachLoggedIn(): boolean {
//     const user = StorageService.getUser();
//     if(user == null){
//       return false;
//     }
//     return user && user.roles && user.roles.includes('COACH');
//   }

//   static isBhTrainerLoggedIn(): boolean {
//     const user = StorageService.getUser();
//     if(user == null){
//       return false;
//     }
//     return user && user.roles && user.roles.includes('BH_TRAINER');
//   }

//   static isMentorLoggedIn(): boolean {
//     const user = StorageService.getUser();
//     if(user == null){
//       return false;
//     }
//     return user && user.roles && user.roles.includes('MENTOR');
//   }

//   static isCRLoggedIn(): boolean {
//     const user = StorageService.getUser();
//     if(user == null){
//       return false;
//     }
//     return user && user.roles && user.roles.includes('CR');
//   }

//   static signOut(): void {
//     window.localStorage.removeItem(USER);
//   }
// }

// src/app/services/storage.service.ts

import { Injectable } from '@angular/core';
import { LoginResponse } from './auth.service';
import { RoleValue } from '../shared/constants/roles'; // Import your RoleValue type if it's defined elsewhere

const USER = "attendance_user";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  static saveUser(user: LoginResponse): void { // Changed 'any' to 'LoginResponse' for stronger typing
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  static getUser(): LoginResponse | null {
    const user = window.localStorage.getItem(USER);
    if (!user) {
      return null;
    }
    try {
      const userObject: LoginResponse = JSON.parse(user);
      return userObject;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  }

  static getUserId(): string | null {
    const user = StorageService.getUser();
    // Assuming LoginResponse has a 'userId' or 'id' for the actual user ID
    // If 'username' is truly the unique ID you use on the backend for things like '/users/{id}', use user.username
    // Otherwise, ensure your LoginResponse contains a dedicated 'id' field
    return user ? user.username : null; // Or user.id if your LoginResponse has it
  }

  static getAssociateId(): string | null {
    // Prefer reading from stored user object
    const user = StorageService.getUser();
    if (user && (user as any).associateId) {
      return (user as any).associateId as string;
    }
    // Fallback to dedicated key if set
    return window.localStorage.getItem('associateId');
  }


  static getToken(): string | null {
    const user = StorageService.getUser();
    return user ? user.jwtToken : null;
  }

  /**
   * Returns the *primary* role of the user, typically the first one in the array.
   * Use this when you need a single representative role.
   * For specific role checks, prefer the `isXxxLoggedIn` methods.
   */
  static getUserPrimaryRole(): RoleValue | null { // Changed name to clarify it's primary
    const user = StorageService.getUser();
    // Ensure user exists and has roles, then return the first role
    return user && user.roles && user.roles.length > 0 ? (user.roles[0] as RoleValue) : null;
  }


  static hasRole(role: RoleValue): boolean {
    const user = StorageService.getUser();
    // Ensure user exists and their roles array includes the requiredRole
    return user !== null && user.roles.includes(role);
  }

  /**
   * Checks if the user is logged in and has *any* of the specified roles.
   * @param requiredRoles An array of RoleValue to check against.
   * @returns True if logged in and has at least one of the roles, false otherwise.
   */
  static hasAnyRole(requiredRoles: RoleValue[]): boolean {
    const user = StorageService.getUser();
    if (!user || !user.roles) {
      return false; // No user or no roles array
    }
    // Check if any of the user's roles are in the requiredRoles list
    return requiredRoles.some(role => user.roles.includes(role));
  }

  /**
   * Checks if the user is logged in AND has the 'ADMIN' role.
   * Assumes roles array contains string values like 'ROLE_ADMIN'.
   */
  static isAdminLoggedIn(): boolean {
    const user = StorageService.getUser();
    return user !== null && user.roles.includes('ROLE_ADMIN'); // Match role string from routes
  }

  static isSkillingLeadLoggedIn(): boolean {
    const user = StorageService.getUser();
    return user !== null && user.roles.includes('ROLE_SKILLING_LEAD'); // Match role string from routes
  }

  static isAcademicCoordinatorLoggedIn(): boolean {
    const user = StorageService.getUser();
    return user !== null && user.roles.includes('ROLE_ACADEMIC_COORDINATOR'); // Match role string from routes
  }

  static isTechTrainerLoggedIn(): boolean {
    const user = StorageService.getUser();
    return user !== null && user.roles.includes('ROLE_TECHNICAL_TRAINER'); // Match role string from routes
  }

  static isCoachLoggedIn(): boolean {
    const user = StorageService.getUser();
    return user !== null && user.roles.includes('ROLE_COACH'); // Match role string from routes
  }

  static isBhTrainerLoggedIn(): boolean {
    const user = StorageService.getUser();
    return user !== null && user.roles.includes('ROLE_BH_TRAINER'); // Match role string from routes
  }

  static isMentorLoggedIn(): boolean {
    const user = StorageService.getUser();
    return user !== null && user.roles.includes('ROLE_MENTOR'); // Match role string from routes
  }

  static isCRLoggedIn(): boolean {
    const user = StorageService.getUser();
    return user !== null && user.roles.includes('ROLE_CR'); // Match role string from routes
  }

  static isGuestLoggedIn(): boolean {
    const user = StorageService.getUser();
    return user !== null && user.roles.includes('ROLE_GUEST'); // Match role string from routes
  }

  /**
   * Checks if the current user has read-only access (i.e., is a guest user)
   * Guest users can view everything but cannot create, edit, or delete
   */
  static isReadOnly(): boolean {
    return StorageService.isGuestLoggedIn();
  }

  /**
   * Checks if the current user can manage cohorts (create, edit, delete)
   * Only ADMIN and ACADEMY_COORDINATOR can manage cohorts
   * Other roles (MENTOR, COACH, TRAINER, BH_TRAINER, CR, GUEST) can only view
   */
  static canManageCohorts(): boolean {
    const user = StorageService.getUser();
    if (!user || !user.roles) {
      return false;
    }
    // Only ADMIN and ACADEMY_COORDINATOR can create/edit/delete cohorts
    return user.roles.includes('ROLE_ADMIN') ||
           user.roles.includes('ROLE_ACADEMY_COORDINATOR');
  }

  /**
   * Checks if the current user can manage admin settings (domain, vertical, service line, location, users)
   * Only ADMIN can manage these settings
   */
  static canManageAdminSettings(): boolean {
    const user = StorageService.getUser();
    if (!user || !user.roles) {
      return false;
    }
    // Only ADMIN can manage admin settings
    return user.roles.includes('ROLE_ADMIN');
  }

  static signOut(): void {
    window.localStorage.removeItem(USER);
    window.localStorage.removeItem('associateId');
  }
}
