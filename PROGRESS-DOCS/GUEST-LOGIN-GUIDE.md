# Guest Login Feature - Implementation Guide

## 📖 Overview

The Guest Login feature allows visitors to explore the Training Management System with **read-only access** to all features that an admin can see, without the ability to create, edit, or delete any data.

## 🎯 Features

### Backend Implementation

1. **New Role Added**: `ROLE_GUEST` in `UserRoles.java` enum
2. **Guest Login Endpoint**: `/auth/guest-login` (POST)
3. **Security Configuration**: 
   - GUEST users can access all GET endpoints
   - GUEST users are blocked from POST, PUT, DELETE, PATCH operations
4. **JWT Token**: Guest users receive a valid JWT token with ROLE_GUEST

### Frontend Implementation

1. **Guest Login Button**: Styled, interactive "Guest" link on login page
2. **Auto-Redirection**: Guest users are redirected to admin dashboard
3. **Read-Only Mode**: Helper methods to check if user is guest
4. **UI Restrictions**: Components can hide/disable action buttons for guests

## 🚀 How to Use

### For End Users

1. Navigate to the login page
2. Click on the **"Guest"** link below the Sign In button
3. You'll be automatically logged in and redirected to the admin dashboard
4. Browse all features - view cohorts, trainees, events, learning paths, etc.
5. Action buttons (Create, Edit, Delete) should be hidden or disabled

### For Developers - Adding Read-Only Restrictions

#### Method 1: Using StorageService (Recommended)

```typescript
import { StorageService } from 'src/app/services/storage.service';

export class YourComponent {
  isReadOnly = StorageService.isReadOnly();
  isGuest = StorageService.isGuestLoggedIn();
  
  canEdit(): boolean {
    return !this.isReadOnly;
  }
}
```

#### Method 2: In Template (HTML)

```html
<!-- Hide button for guest users -->
<button mat-raised-button 
        color="primary" 
        *ngIf="!isReadOnly"
        (click)="createCohort()">
  Create New Cohort
</button>

<!-- Disable button for guest users -->
<button mat-raised-button 
        color="primary" 
        [disabled]="isReadOnly"
        (click)="editTrainee()">
  Edit Trainee
</button>

<!-- Show read-only message -->
<div *ngIf="isGuest" class="guest-notice">
  <mat-icon>visibility</mat-icon>
  <span>You are in read-only mode as a Guest</span>
</div>
```

#### Method 3: Programmatic Check Before Actions

```typescript
onDeleteClick(id: string) {
  if (StorageService.isReadOnly()) {
    this.snackBar.open(
      'Action not allowed. Guest users have read-only access.',
      'Close',
      { duration: 3000 }
    );
    return;
  }
  
  // Proceed with delete
  this.deleteItem(id);
}
```

## 🔐 Backend Security

### SecurityConfig.java

```java
// Guest users can read everything
.requestMatchers(HttpMethod.GET, "/api/**")
  .hasAnyRole("GUEST", "ADMIN", "SKILLING_LEAD", /* ... other roles */)

// Guest users cannot write
.requestMatchers(HttpMethod.POST, "/api/**")
  .hasAnyRole("ADMIN", "SKILLING_LEAD", /* ... other roles except GUEST */)
  
.requestMatchers(HttpMethod.PUT, "/api/**")
  .hasAnyRole("ADMIN", "SKILLING_LEAD", /* ... other roles except GUEST */)
  
.requestMatchers(HttpMethod.DELETE, "/api/**")
  .hasAnyRole("ADMIN", "SKILLING_LEAD", /* ... other roles except GUEST */)
```

This ensures that even if a guest user somehow triggers a write operation from the frontend, the backend will reject it with a 403 Forbidden response.

## 📝 Components to Update with Read-Only Restrictions

### High Priority (Action Buttons Present)

1. **Cohort Management**
   - Hide "Add Cohort" button
   - Disable "Edit Cohort" button
   - Disable "Delete Cohort" button
   - File: `cohort.component.ts`

2. **Trainee Management**
   - Hide "Add Trainee" button
   - Disable "Edit Trainee" button
   - Disable "Delete Trainee" button
   - Disable "Bulk Upload" button
   - File: `trainees.component.ts`

3. **Learning Path Management**
   - Hide "Create Learning Path" button
   - Disable "Edit Learning Path" button
   - Disable "Delete Learning Path" button
   - File: `learning-path.component.ts`

4. **Events/Calendar**
   - Hide "Create Event" button
   - Disable "Edit Event" button
   - Disable "Delete Event" button
   - File: Event-related components

5. **Admin User Management**
   - Hide "Add User" button
   - Disable "Edit User" button
   - Disable "Delete User" button
   - File: Admin components

### Example Implementation for Cohort Component

```typescript
// cohort.component.ts
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

export class CohortComponent implements OnInit {
  isReadOnly: boolean = false;
  
  ngOnInit() {
    this.isReadOnly = StorageService.isReadOnly();
  }
  
  onAddCohort() {
    if (this.isReadOnly) {
      this.snackBar.open(
        'Cannot add cohort. Guest users have read-only access.',
        'Close',
        { duration: 3000, panelClass: ['warn-snackbar'] }
      );
      return;
    }
    
    // Open add cohort dialog
    this.openAddDialog();
  }
  
  onEditCohort(cohort: any) {
    if (this.isReadOnly) {
      this.snackBar.open(
        'Cannot edit cohort. Guest users have read-only access.',
        'Close',
        { duration: 3000, panelClass: ['warn-snackbar'] }
      );
      return;
    }
    
    // Open edit dialog
    this.openEditDialog(cohort);
  }
}
```

```html
<!-- cohort.component.html -->
<button mat-raised-button 
        color="primary" 
        *ngIf="!isReadOnly"
        (click)="onAddCohort()">
  <mat-icon>add</mat-icon>
  Add Cohort
</button>

<!-- In table actions -->
<button mat-icon-button 
        [disabled]="isReadOnly"
        [matTooltip]="isReadOnly ? 'Read-only mode' : 'Edit'"
        (click)="onEditCohort(cohort)">
  <mat-icon>edit</mat-icon>
</button>

<button mat-icon-button 
        [disabled]="isReadOnly"
        [matTooltip]="isReadOnly ? 'Read-only mode' : 'Delete'"
        (click)="onDeleteCohort(cohort)">
  <mat-icon>delete</mat-icon>
</button>
```

## 🎨 Styling Recommendations

### Guest Notice Banner

Add a persistent banner at the top of the page when guest is logged in:

```html
<!-- In full.component.html or main layout -->
<div *ngIf="isGuest" class="guest-banner">
  <mat-icon>visibility</mat-icon>
  <span>You are browsing in <strong>Read-Only Mode</strong> as a Guest</span>
</div>
```

```scss
.guest-banner {
  background: #fff3cd;
  color: #856404;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #ffeeba;
  font-size: 14px;
  
  mat-icon {
    font-size: 20px;
    height: 20px;
    width: 20px;
  }
  
  strong {
    font-weight: 600;
  }
}
```

### Disabled Button Styling

```scss
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  
  &:hover {
    background-color: inherit;
  }
}
```

## 🧪 Testing Checklist

### Backend Tests

- [ ] POST /auth/guest-login returns valid JWT token
- [ ] JWT token contains ROLE_GUEST
- [ ] GET requests work with guest token
- [ ] POST requests fail with 403 for guest token
- [ ] PUT requests fail with 403 for guest token
- [ ] DELETE requests fail with 403 for guest token

### Frontend Tests

1. **Guest Login Flow**
   - [ ] Click "Guest" link on login page
   - [ ] Verify redirect to admin dashboard
   - [ ] Verify welcome message appears
   - [ ] Verify JWT token saved in localStorage

2. **Read-Only Restrictions**
   - [ ] All "Create" buttons hidden or disabled
   - [ ] All "Edit" buttons disabled
   - [ ] All "Delete" buttons disabled
   - [ ] Clicking disabled buttons shows warning message
   - [ ] All view/list pages load correctly
   - [ ] All detail pages load correctly

3. **Navigation**
   - [ ] Guest can navigate to all admin pages
   - [ ] Guest can view cohorts
   - [ ] Guest can view trainees
   - [ ] Guest can view learning paths
   - [ ] Guest can view events
   - [ ] Guest can view reports/dashboards

4. **Security**
   - [ ] Guest cannot bypass restrictions via console
   - [ ] Backend rejects write operations from guest
   - [ ] Guest session expires correctly
   - [ ] Logout clears guest session

## 🔄 Migration from Existing Code

If you already have components with action buttons, follow these steps:

### Step 1: Import StorageService

```typescript
import { StorageService } from 'src/app/services/storage.service';
```

### Step 2: Add isReadOnly Property

```typescript
export class YourComponent {
  isReadOnly = StorageService.isReadOnly();
}
```

### Step 3: Update Templates

```html
<!-- Before -->
<button (click)="onCreate()">Create</button>

<!-- After -->
<button *ngIf="!isReadOnly" (click)="onCreate()">Create</button>

<!-- OR -->
<button [disabled]="isReadOnly" (click)="onCreate()">Create</button>
```

### Step 4: Add Guards in Methods

```typescript
onCreate() {
  if (this.isReadOnly) {
    this.showReadOnlyMessage();
    return;
  }
  // ... existing logic
}

private showReadOnlyMessage() {
  this.snackBar.open(
    'Action not allowed. Guest users have read-only access.',
    'Close',
    { duration: 3000, panelClass: ['warn-snackbar'] }
  );
}
```

## 📊 Guest Analytics (Optional Enhancement)

You can track guest usage:

```typescript
// In guest login method
if (response.roles.includes('ROLE_GUEST')) {
  this.analyticsService.trackEvent('guest_login', {
    timestamp: new Date(),
    // No PII - just anonymous usage tracking
  });
}
```

## 🚀 Production Deployment

1. **Backend**: 
   - Rebuild Spring Boot app: `mvn clean package`
   - Deploy to Render
   - Verify `/auth/guest-login` endpoint is accessible

2. **Frontend**: 
   - Build Angular app: `npm run build -- --configuration=production`
   - Deploy to Netlify/Vercel
   - Test guest login in production

3. **Verification**:
   - Test guest login works
   - Verify read-only restrictions in place
   - Check backend logs for any 403 errors from guest writes

## 📚 API Reference

### Guest Login Endpoint

**URL**: `/auth/guest-login`  
**Method**: `POST`  
**Auth Required**: No  
**Body**: Empty `{}`

**Success Response**:
```json
{
  "success": true,
  "message": "Guest login successful!",
  "username": "guest@trainingms.com",
  "roles": ["ROLE_GUEST"],
  "jwtToken": "eyJhbGc...",
  "associateId": "GUEST"
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Guest login failed: [error details]",
  "username": null,
  "roles": null,
  "jwtToken": null,
  "associateId": null
}
```

## 🛠️ Troubleshooting

### Issue: Guest login returns 401 Unauthorized
- **Solution**: Check SecurityConfig - ensure `/auth/**` is `.permitAll()`

### Issue: Guest can perform write operations
- **Solution**: Check SecurityConfig HTTP method matchers - ensure GUEST is excluded from POST/PUT/DELETE

### Issue: Guest sees blank page after login
- **Solution**: Verify `app.routes.ts` includes `ROLE_GUEST` in admin route data.roles

### Issue: Action buttons still visible for guest
- **Solution**: Add `*ngIf="!isReadOnly"` or `[disabled]="isReadOnly"` to buttons in component templates

## 📞 Support

For questions or issues with the guest login feature, contact the development team or create an issue in the repository.

---

**Last Updated**: December 2025  
**Version**: 1.0  
**Author**: Training Management System Development Team
