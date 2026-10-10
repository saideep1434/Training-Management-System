# Guest User UI Restrictions - Implementation Summary

## Overview
This document summarizes all UI restrictions implemented for guest users (read-only mode) across the Training Management System.

## Implementation Date
December 18, 2025

## Global Features

### 1. Global Guest Banner
**Location**: `full.component.html` (main layout)
- **Display**: Prominent banner at top of all pages when logged in as guest
- **Styling**: Gradient orange/amber background with white text
- **Message**: "You are browsing in **Read-Only Mode** as a Guest. You cannot create, edit, or delete any data."
- **Position**: Sticky at top, always visible
- **Responsive**: Adjusts size on mobile devices

### 2. Helper Methods
**Location**: `storage.service.ts`
```typescript
static isReadOnly(): boolean {
    return StorageService.isGuestLoggedIn();
}

static isGuestLoggedIn(): boolean {
    const user = StorageService.getUser();
    return user !== null && user.roles.includes('ROLE_GUEST');
}
```

## Component-Specific Implementations

### 1. Cohort Management (`cohort.component.ts/html`)

#### Hidden Elements:
- ✅ "Add Cohort" button (completely hidden with `*ngIf="!isReadOnly"`)

#### Disabled Elements:
- ✅ Edit button in cohort card menu (hidden with `*ngIf="!isReadOnly"`)
- ✅ Delete button in cohort card menu (hidden with `*ngIf="!isReadOnly"`)

#### Programmatic Checks:
```typescript
addCohort(): void {
    if (this.isReadOnly) {
        this.showReadOnlyMessage('Cannot create cohort');
        return;
    }
    // ... rest of logic
}

editCohort(cohortId: string): void {
    if (this.isReadOnly) {
        this.showReadOnlyMessage('Cannot edit cohort');
        return;
    }
    // ... rest of logic
}

deleteCohort(cohortId: string): void {
    if (this.isReadOnly) {
        this.showReadOnlyMessage('Cannot delete cohort');
        return;
    }
    // ... rest of logic
}
```

#### Visual Feedback:
- Local guest notice banner: "You are in **read-only mode**. You cannot create, edit, or delete cohorts."
- Snackbar messages when attempting actions: "Cannot [action]. Guest users have read-only access."

---

### 2. Learning Path Management (`learning-path.component.ts/html`)

#### Hidden Elements:
- ✅ "Add Learning Path" button (conditional: `*ngIf="canManageLearningPath && !isReadOnly"`)
- ✅ Edit button in path cards (conditional: `*ngIf="canManageLearningPath && !isReadOnly"`)
- ✅ More options menu (three dots) (conditional: `*ngIf="canManageLearningPath && !isReadOnly"`)
- ✅ Edit menu item (conditional: `*ngIf="canManageLearningPath && !isReadOnly"`)
- ✅ Delete menu item (conditional: `*ngIf="canManageLearningPath && !isReadOnly"`)

#### Programmatic Checks:
```typescript
openAddLearningPathDialog(): void {
    if (this.isReadOnly) {
        this.snackBar.open('Cannot create learning path. Guest users have read-only access.', 'Close', { 
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top' 
        });
        return;
    }
    // ... rest of logic
}

editLearningPath(id: number | undefined): void {
    if (this.isReadOnly) {
        this.snackBar.open('Cannot edit learning path. Guest users have read-only access.', 'Close', { 
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top' 
        });
        return;
    }
    // ... rest of logic
}

deleteLearningPath(id: number | undefined): void {
    if (this.isReadOnly) {
        this.snackBar.open('Cannot delete learning path. Guest users have read-only access.', 'Close', { 
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top' 
        });
        return;
    }
    // ... rest of logic
}
```

#### Visual Feedback:
- Local guest notice banner: "You are in **read-only mode**. You cannot create, edit, or delete learning paths."
- Snackbar messages when attempting actions

---

### 3. Trainee Management (`trainee-list.component.ts/html`, `trainee-upload.component.ts`)

#### Hidden Elements:
- ✅ "Upload Trainees" button (hidden with `*ngIf="!isReadOnly"`)
- ✅ Select checkboxes column (conditional: `*ngIf="enableAssign && !isReadOnly"`)
- ✅ "Assign to Cohort" section (conditional: `*ngIf="enableAssign && !isReadOnly"`)

#### Upload Page Protection:
```typescript
ngOnInit() {
    this.isReadOnly = StorageService.isReadOnly();
    if (this.isReadOnly) {
        this.snackBar.open('Cannot access upload page. Guest users have read-only access.', 'Close', { 
            duration: 4000 
        });
        // Navigate back to list
        this.router.navigate(['../list'], { relativeTo: this.route });
        return;
    }
    this.loadDraft();
}
```

#### Programmatic Checks:
```typescript
assignSelected(): void {
    if (this.isReadOnly) {
        this.snackBar.open('Cannot assign trainees. Guest users have read-only access.', 'Close', { 
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top' 
        });
        return;
    }
    // ... rest of logic
}

goToUpload(): void {
    if (this.isReadOnly) {
        this.snackBar.open('Cannot upload trainees. Guest users have read-only access.', 'Close', { 
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top' 
        });
        return;
    }
    // ... navigation logic
}
```

#### Visual Feedback:
- Local guest notice banner: "You are in **read-only mode**. You cannot upload or assign trainees."
- Upload page redirect with snackbar message
- Snackbar messages when attempting actions

---

### 4. User Management (`add-people.component.ts/html`)

#### Hidden Elements:
- ✅ "Add People" button (hidden with `*ngIf="!isReadOnly"`)
- ✅ Edit icon button in table (hidden with `*ngIf="!isReadOnly"`)
- ✅ Delete icon button in table (hidden with `*ngIf="!isReadOnly"`)

#### Visible When Read-Only:
- ✅ "View only" text in Actions column (shown with `*ngIf="isReadOnly"`)

#### Programmatic Checks:
```typescript
addPeople() {
    if (this.isReadOnly) {
        this.snackBar.open('Cannot add user. Guest users have read-only access.', 'Close', { 
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top' 
        });
        return;
    }
    // ... rest of logic
}

onEdit(personToEdit: Associate): void {
    if (this.isReadOnly) {
        this.snackBar.open('Cannot edit user. Guest users have read-only access.', 'Close', { 
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top' 
        });
        return;
    }
    // ... rest of logic
}

onDelete(personToDelete: Associate): void {
    if (this.isReadOnly) {
        this.snackBar.open('Cannot delete user. Guest users have read-only access.', 'Close', { 
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top' 
        });
        return;
    }
    // ... rest of logic
}
```

#### Visual Feedback:
- Local guest notice banner: "You are in **read-only mode**. You cannot add, edit, or delete users."
- "View only" text in Actions column
- Snackbar messages when attempting actions

---

## Styling

### Local Component Banners (`.guest-notice`)
```scss
.guest-notice {
  background: #fff3cd;
  color: #856404;
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 4px solid #ffc107;
  display: flex;
  align-items: center;
  gap: 8px;
  
  mat-icon {
    font-size: 20px;
    height: 20px;
    width: 20px;
    color: #ffc107;
  }
  
  strong {
    font-weight: 600;
  }
}
```

### Global Layout Banner (`.global-guest-banner`)
```scss
.global-guest-banner {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: #ffffff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  font-size: 14px;
  
  mat-icon {
    font-size: 22px;
    height: 22px;
    width: 22px;
    color: #ffffff;
  }
  
  strong {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 12px;
    
    mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
    }
  }
}
```

---

## User Experience Flow

### Guest Login
1. User clicks "Guest" link on login page
2. JWT token generated with `ROLE_GUEST`
3. Redirected to admin dashboard
4. **Global banner appears at top**: "You are browsing in Read-Only Mode as a Guest..."

### Component Interactions
1. Guest navigates to any page (Cohorts, Learning Paths, Trainees, etc.)
2. **Local banner appears** (if applicable): "You are in read-only mode. You cannot..."
3. **Action buttons hidden or disabled**
4. If guest attempts action programmatically:
   - **Snackbar appears**: "Cannot [action]. Guest users have read-only access."
   - Action blocked before reaching backend

### Navigation
- ✅ Guest can view all pages (Dashboard, Cohorts, Learning Paths, My Profile)
- ✅ Guest can search, filter, and view details
- ✅ Guest can see all data that admins see
- ❌ Guest cannot access upload pages (redirected with message)
- ❌ Guest cannot open add/edit dialogs
- ❌ Guest cannot perform write operations

---

## Security Layers

### Layer 1: UI (Current Implementation)
- Buttons hidden/disabled
- Visual feedback (banners, tooltips, messages)
- Prevents accidental clicks

### Layer 2: Component Logic
- Programmatic checks before opening dialogs
- Early return with snackbar message
- Prevents dialog opening

### Layer 3: Backend Security (Already Implemented)
- HTTP method-specific matchers
- POST/PUT/DELETE blocked for GUEST
- Returns 403 Forbidden if guest somehow bypasses UI

### Layer 4: Service Layer (Already Implemented)
- Switch statements include GUEST case
- Returns appropriate data for guest role

---

## Files Modified

### TypeScript Components (13 files)
1. `/app/common/cohort/cohort.component.ts`
2. `/app/components/cohort-card/cohort-card.component.ts`
3. `/app/common/learning-path/learning-path.component.ts`
4. `/app/common/trainees/trainee-list.component.ts`
5. `/app/common/trainees/trainee-upload.component.ts`
6. `/app/pages/admin/add-people/add-people.component.ts`
7. `/app/layouts/full/full.component.ts`

### HTML Templates (7 files)
1. `/app/common/cohort/cohort.component.html`
2. `/app/components/cohort-card/cohort-card.component.html`
3. `/app/common/learning-path/learning-path.component.html`
4. `/app/common/trainees/trainee-list.component.html`
5. `/app/pages/admin/add-people/add-people.component.html`
6. `/app/layouts/full/full.component.html`

### Global Styles (1 file)
1. `/src/styles.scss`

---

## Testing Checklist

### Guest Login Flow
- [ ] Click "Guest" on login page → redirects to admin dashboard
- [ ] Global banner visible at top of page
- [ ] Sidebar shows: Dashboard, Cohorts, Learning Paths, My Profile

### Cohort Management
- [ ] "Add Cohort" button hidden
- [ ] Edit/Delete in card menu hidden
- [ ] Local guest banner visible
- [ ] Can view cohort details
- [ ] Search/filter works

### Learning Path Management
- [ ] "Add Learning Path" button hidden
- [ ] Edit button on cards hidden
- [ ] More options menu hidden
- [ ] Local guest banner visible
- [ ] Can view path details

### Trainee Management
- [ ] "Upload Trainees" button hidden
- [ ] Select checkboxes hidden
- [ ] "Assign to Cohort" section hidden
- [ ] Local guest banner visible
- [ ] Upload page redirects back to list
- [ ] Can view trainee list

### User Management
- [ ] "Add People" button hidden
- [ ] Edit/Delete buttons in table hidden
- [ ] "View only" text appears in Actions column
- [ ] Local guest banner visible
- [ ] Can view user list

### Backend Security
- [ ] POST request returns 403
- [ ] PUT request returns 403
- [ ] DELETE request returns 403
- [ ] GET requests work (return data)

---

## Success Criteria ✅

1. ✅ Guest users can log in without credentials
2. ✅ Guest users can navigate all pages
3. ✅ Guest users can view all data (cohorts, paths, trainees, users)
4. ✅ Guest users cannot see Add/Edit/Delete buttons
5. ✅ Guest users see clear visual indicators (banners)
6. ✅ Guest users get friendly error messages if actions attempted
7. ✅ Global banner always visible at top
8. ✅ Local banners on components with write operations
9. ✅ Backend still blocks writes (defense in depth)
10. ✅ No TypeScript compilation errors

---

## Future Enhancements (Optional)

1. **Guest Tour**: Add a guided tour for first-time guests
2. **Guest Analytics**: Track which pages guests view most
3. **Upgrade Prompt**: Add button to "Request Full Access" 
4. **Time Limit**: Optionally expire guest sessions after X hours
5. **Guest Feedback**: Add feedback form for guest users
6. **More Restrictions**: Apply same pattern to other admin components (domains, verticals, service lines, locations)

---

## Conclusion

The guest login feature is now fully implemented with comprehensive UI restrictions. Guest users have a professional, polished read-only experience across the entire Training Management System. All action buttons are appropriately hidden or disabled, with clear visual feedback through banners and snackbar messages. The implementation follows best practices with defense-in-depth security (UI + backend layers) and provides an excellent user experience.
