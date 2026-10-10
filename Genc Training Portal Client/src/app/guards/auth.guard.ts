import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, UserProfile } from '../services/auth.service'; // Adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data['roles'] as UserProfile[];

    // return true;

    if (!this.authService.isLoggedIn()) {
      console.warn('RoleGuard: User not logged in. Redirecting to login page.');
      return this.router.createUrlTree(['/authentication/login']);
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (this.authService.hasAnyRole(requiredRoles)) {
      return true;
    } else {
      // FIX: Access roles from the full user object, join them for display
      const userRoles = this.authService.getCurrentUser()?.roles || ['Unknown Role'];
      console.warn(
        `RoleGuard: Access denied for user with role(s) '${userRoles.join(', ')}'. ` +
        `Required roles: ${requiredRoles.join(', ')}. ` +
        `Redirecting to unauthorized page.`
      );
      this.authService.logout();
      return this.router.createUrlTree(['/authentication/login']);
    }
  }
}