# Guest Login - Component Update Example

This file shows a complete before/after example of updating a component to support guest read-only mode.

## Example: Cohort Component

### BEFORE (No Guest Support)

```typescript
// cohort.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CohortService } from 'src/app/services/cohort.service';
import { AddCohortDialogComponent } from '../add-cohort-dialog/add-cohort-dialog.component';

export class CohortComponent implements OnInit {
  cohorts: any[] = [];

  constructor(
    private cohortService: CohortService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCohorts();
  }

  loadCohorts() {
    this.cohortService.getAllCohorts().subscribe({
      next: (data) => this.cohorts = data,
      error: (err) => console.error(err)
    });
  }

  onAddCohort() {
    const dialogRef = this.dialog.open(AddCohortDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCohorts();
      }
    });
  }

  onEditCohort(cohort: any) {
    console.log('Edit cohort:', cohort);
    // TODO: Implement edit dialog
  }

  onDeleteCohort(cohort: any) {
    console.log('Delete cohort:', cohort);
    // TODO: Implement delete confirmation
  }

  onSearchCohort(searchTerm: string) {
    // Search implementation
  }
}
```

```html
<!-- cohort.component.html -->
<div class="cohort-container">
  <div class="header">
    <h2>Cohort Management</h2>
    <button mat-raised-button color="primary" (click)="onAddCohort()">
      <mat-icon>add</mat-icon>
      Add Cohort
    </button>
  </div>

  <mat-form-field class="search-field">
    <mat-label>Search Cohorts</mat-label>
    <input matInput (keyup)="onSearchCohort($event.target.value)">
    <mat-icon matSuffix>search</mat-icon>
  </mat-form-field>

  <table mat-table [dataSource]="cohorts">
    <!-- Columns -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef>Cohort Name</th>
      <td mat-cell *matCellDef="let cohort">{{cohort.name}}</td>
    </ng-container>

    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef>Actions</th>
      <td mat-cell *matCellDef="let cohort">
        <button mat-icon-button (click)="onEditCohort(cohort)">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button (click)="onDeleteCohort(cohort)">
          <mat-icon>delete</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
  </table>
</div>
```

---

## AFTER (With Guest Support) ✅

```typescript
// cohort.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CohortService } from 'src/app/services/cohort.service';
import { StorageService } from 'src/app/services/storage.service'; // ✅ ADDED
import { AddCohortDialogComponent } from '../add-cohort-dialog/add-cohort-dialog.component';

export class CohortComponent implements OnInit {
  cohorts: any[] = [];
  isReadOnly = false; // ✅ ADDED

  constructor(
    private cohortService: CohortService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isReadOnly = StorageService.isReadOnly(); // ✅ ADDED
    this.loadCohorts();
  }

  loadCohorts() {
    this.cohortService.getAllCohorts().subscribe({
      next: (data) => this.cohorts = data,
      error: (err) => console.error(err)
    });
  }

  onAddCohort() {
    // ✅ ADDED: Guard for read-only mode
    if (this.isReadOnly) {
      this.showReadOnlyMessage('Cannot add cohort');
      return;
    }

    const dialogRef = this.dialog.open(AddCohortDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCohorts();
      }
    });
  }

  onEditCohort(cohort: any) {
    // ✅ ADDED: Guard for read-only mode
    if (this.isReadOnly) {
      this.showReadOnlyMessage('Cannot edit cohort');
      return;
    }

    console.log('Edit cohort:', cohort);
    // TODO: Implement edit dialog
  }

  onDeleteCohort(cohort: any) {
    // ✅ ADDED: Guard for read-only mode
    if (this.isReadOnly) {
      this.showReadOnlyMessage('Cannot delete cohort');
      return;
    }

    console.log('Delete cohort:', cohort);
    // TODO: Implement delete confirmation
  }

  onSearchCohort(searchTerm: string) {
    // Search implementation (read-only operation, no guard needed)
  }

  // ✅ ADDED: Helper method for read-only messages
  private showReadOnlyMessage(action: string) {
    this.snackBar.open(
      `${action}. Guest users have read-only access.`,
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warn-snackbar']
      }
    );
  }
}
```

```html
<!-- cohort.component.html -->
<div class="cohort-container">
  <!-- ✅ ADDED: Guest notice banner -->
  <div *ngIf="isReadOnly" class="guest-notice">
    <mat-icon>visibility</mat-icon>
    <span>You are in <strong>read-only mode</strong></span>
  </div>

  <div class="header">
    <h2>Cohort Management</h2>
    <!-- ✅ CHANGED: Hide button for guests -->
    <button mat-raised-button 
            color="primary" 
            *ngIf="!isReadOnly"
            (click)="onAddCohort()">
      <mat-icon>add</mat-icon>
      Add Cohort
    </button>
  </div>

  <mat-form-field class="search-field">
    <mat-label>Search Cohorts</mat-label>
    <input matInput (keyup)="onSearchCohort($event.target.value)">
    <mat-icon matSuffix>search</mat-icon>
  </mat-form-field>

  <table mat-table [dataSource]="cohorts">
    <!-- Columns -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef>Cohort Name</th>
      <td mat-cell *matCellDef="let cohort">{{cohort.name}}</td>
    </ng-container>

    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef>Actions</th>
      <td mat-cell *matCellDef="let cohort">
        <!-- ✅ CHANGED: Disable buttons for guests -->
        <button mat-icon-button 
                [disabled]="isReadOnly"
                [matTooltip]="isReadOnly ? 'Read-only mode' : 'Edit cohort'"
                (click)="onEditCohort(cohort)">
          <mat-icon>edit</mat-icon>
        </button>
        <button mat-icon-button 
                [disabled]="isReadOnly"
                [matTooltip]="isReadOnly ? 'Read-only mode' : 'Delete cohort'"
                (click)="onDeleteCohort(cohort)">
          <mat-icon>delete</mat-icon>
        </button>
        <!-- ✅ ADDED: View button visible for all users -->
        <button mat-icon-button 
                matTooltip="View details"
                [routerLink]="['/admin/cohort', cohort.id]">
          <mat-icon>visibility</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
  </table>

  <!-- ✅ ADDED: Empty state (visible to all users) -->
  <div *ngIf="cohorts.length === 0" class="empty-state">
    <mat-icon>inbox</mat-icon>
    <p>No cohorts found</p>
    <button mat-raised-button 
            color="primary" 
            *ngIf="!isReadOnly"
            (click)="onAddCohort()">
      Create First Cohort
    </button>
  </div>
</div>
```

```scss
/* cohort.component.scss */

/* ✅ ADDED: Guest notice styling */
.guest-notice {
  background: #fff3cd;
  color: #856404;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  mat-icon {
    font-size: 20px;
    height: 20px;
    width: 20px;
  }
  
  strong {
    font-weight: 600;
  }
}

/* ✅ ADDED: Disabled button styling */
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.cohort-container {
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-field {
  width: 100%;
  margin-bottom: 16px;
}

table {
  width: 100%;
}

/* ✅ ADDED: Empty state styling */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  
  mat-icon {
    font-size: 64px;
    height: 64px;
    width: 64px;
    color: #9e9e9e;
    margin-bottom: 16px;
  }
  
  p {
    color: #666;
    margin-bottom: 24px;
  }
}
```

---

## Summary of Changes

### TypeScript Changes (3 additions)

1. **Import StorageService**
   ```typescript
   import { StorageService } from 'src/app/services/storage.service';
   ```

2. **Add isReadOnly property**
   ```typescript
   isReadOnly = false;
   
   ngOnInit() {
     this.isReadOnly = StorageService.isReadOnly();
   }
   ```

3. **Guard action methods**
   ```typescript
   onAddCohort() {
     if (this.isReadOnly) {
       this.showReadOnlyMessage('Cannot add cohort');
       return;
     }
     // ... rest of method
   }
   ```

4. **Add helper method**
   ```typescript
   private showReadOnlyMessage(action: string) {
     this.snackBar.open(
       `${action}. Guest users have read-only access.`,
       'Close',
       { duration: 3000, panelClass: ['warn-snackbar'] }
     );
   }
   ```

### HTML Changes (3 additions)

1. **Add guest notice banner**
   ```html
   <div *ngIf="isReadOnly" class="guest-notice">
     <mat-icon>visibility</mat-icon>
     <span>You are in <strong>read-only mode</strong></span>
   </div>
   ```

2. **Hide create button**
   ```html
   <button *ngIf="!isReadOnly" (click)="onAddCohort()">
     Add Cohort
   </button>
   ```

3. **Disable action buttons**
   ```html
   <button [disabled]="isReadOnly" 
           [matTooltip]="isReadOnly ? 'Read-only mode' : 'Edit'"
           (click)="onEditCohort(cohort)">
     <mat-icon>edit</mat-icon>
   </button>
   ```

### SCSS Changes (2 additions)

1. **Guest notice styling**
2. **Disabled button styling**

---

## Testing the Changes

### As Regular User
1. Login as admin@trainingms.com
2. Navigate to Cohort page
3. ✅ See "Add Cohort" button
4. ✅ Can click Edit/Delete buttons
5. ✅ No guest notice banner

### As Guest User
1. Click "Guest" on login page
2. Navigate to Cohort page (auto-redirected)
3. ✅ See guest notice banner
4. ✅ No "Add Cohort" button visible
5. ✅ Edit/Delete buttons disabled with tooltip
6. ✅ Clicking disabled buttons shows warning message
7. ✅ Can still view all cohorts and details

---

## Apply This Pattern to Other Components

Use this same pattern for:

- ✅ Trainees Component
- ✅ Learning Path Component
- ✅ Events Component
- ✅ Admin User Management
- ✅ Any component with Create/Edit/Delete actions

**Estimated time per component**: 10-15 minutes

---

## Alternative: Simpler Approach (UI Only)

If you want just UI restrictions without method guards:

```typescript
// TypeScript
isReadOnly = StorageService.isReadOnly();
```

```html
<!-- HTML -->
<button *ngIf="!isReadOnly" (click)="onCreate()">Create</button>
<button [disabled]="isReadOnly" (click)="onEdit()">Edit</button>
<button [disabled]="isReadOnly" (click)="onDelete()">Delete</button>
```

**Note**: Backend security still prevents writes, so this approach is safe but provides less user feedback.

---

**Remember**: The backend security in SecurityConfig.java already prevents guests from making any changes. These UI updates just improve the user experience by making it clear that certain actions are not available.
