import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavItem } from '../models/interfaces/nav-item';
import { NAVIGATION_ROLE_MAPPING, SupportedRole } from '../config/navigation.config';
import { COMMON_NAV_ITEMS } from '../layouts/full/sidebar/sidebar-data';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private navItemsSubject = new BehaviorSubject<NavItem[]>([]);
  public navItems$ = this.navItemsSubject.asObservable();

  private navigationMap = new Map<SupportedRole, () => Promise<NavItem[]>>([
    ['ROLE_ADMIN', () => import('../layouts/full/sidebar/sidebar-data').then(m => m.ADMIN_NAV_ITEMS)],
    ['ROLE_SKILLING_LEAD', () => import('../layouts/full/sidebar/sidebar-data').then(m => m.SKILLING_LEAD_NAV_ITEMS)],
    ['ROLE_ACADEMY_COORDINATOR', () => import('../layouts/full/sidebar/sidebar-data').then(m => m.ACADEMIC_COORDINATOR_NAV_ITEMS)],
    ['ROLE_TECHNICAL_TRAINER', () => import('../layouts/full/sidebar/sidebar-data').then(m => m.TECH_TRAINER_NAV_ITEMS)],
    ['ROLE_COACH', () => import('../layouts/full/sidebar/sidebar-data').then(m => m.COACH_NAV_ITEMS)],
    ['ROLE_BH_TRAINER', () => import('../layouts/full/sidebar/sidebar-data').then(m => m.BH_TRAINER_NAV_ITEMS)],
    ['ROLE_MENTOR', () => import('../layouts/full/sidebar/sidebar-data').then(m => m.MENTOR_NAV_ITEMS)],
    ['ROLE_CR', () => import('../layouts/full/sidebar/sidebar-data').then(m => m.CR_NAV_ITEMS)],
    ['ROLE_GUEST', () => import('../layouts/full/sidebar/sidebar-data').then(m => m.GUEST_NAV_ITEMS)],
  ]);

  async setNavigationForRole(role: string): Promise<void> {
    // Check if the role is supported
    if (!this.isSupportedRole(role)) {
      console.warn(`Unsupported role: ${role}`);
      this.navItemsSubject.next([]);
      return;
    }

    const navigationLoader = this.navigationMap.get(role as SupportedRole);
    if (navigationLoader) {
      try {
  const navItems = await navigationLoader();
  // Merge with common items (e.g., My Profile) appended at the end
  const merged = [...navItems, ...COMMON_NAV_ITEMS];
  this.navItemsSubject.next(merged);
        console.log(`Navigation loaded successfully for role: ${role}`);
      } catch (error) {
        console.error(`Error loading navigation for role ${role}:`, error);
        this.navItemsSubject.next([]);
      }
    } else {
      console.warn(`No navigation configuration found for role: ${role}`);
      this.navItemsSubject.next([]);
    }
  }

  getNavigationForRole(role: string): Observable<NavItem[]> {
    this.setNavigationForRole(role);
    return this.navItems$;
  }

  clearNavigation(): void {
    this.navItemsSubject.next([]);
  }

  private isSupportedRole(role: string): role is SupportedRole {
    return role in NAVIGATION_ROLE_MAPPING;
  }

  // Method to get all supported roles (useful for debugging or admin purposes)
  getSupportedRoles(): string[] {
    return Object.keys(NAVIGATION_ROLE_MAPPING);
  }
}
