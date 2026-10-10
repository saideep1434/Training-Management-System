# Guest Login UI - Quick Visual Test Guide

## Quick Test Steps

### 1. Login as Guest
```
1. Open login page
2. Click "Guest" link (below login button)
3. Should redirect to /admin dashboard
4. ✅ Check: Orange banner at top: "You are browsing in Read-Only Mode as a Guest..."
```

### 2. Test Cohorts Page
```
Navigate to: Cohorts
✅ Check: Yellow local banner: "You are in read-only mode. You cannot create, edit, or delete cohorts."
✅ Check: "Add Cohort" button is HIDDEN
✅ Check: Click three dots menu on any cohort card
    - "View details" option IS visible
    - "Edit" option is HIDDEN
    - "Delete" option is HIDDEN
✅ Check: Can still search/filter cohorts
✅ Check: Can click "View details" and see cohort info
```

### 3. Test Learning Paths Page
```
Navigate to: Learning Paths
✅ Check: Yellow local banner: "You are in read-only mode. You cannot create, edit, or delete learning paths."
✅ Check: "Add Learning Path" button is HIDDEN
✅ Check: Three dots menu on cards is HIDDEN
✅ Check: "Edit" button at bottom of cards is HIDDEN
✅ Check: "View Details" button IS visible and works
```

### 4. Test Trainees Page
```
Navigate to: Cohorts → Select any cohort → Trainees tab
✅ Check: Yellow local banner: "You are in read-only mode. You cannot upload or assign trainees."
✅ Check: "Upload Trainees" button is HIDDEN
✅ Check: Select checkboxes are HIDDEN (no checkbox column)
✅ Check: "Assign to Cohort" section at bottom is HIDDEN
✅ Check: Can still view trainee list
✅ Check: Can still search/filter trainees

Try accessing upload directly:
Navigate to: /admin/cohort/[cohortId]/trainees/upload
✅ Check: Should redirect back to list page
✅ Check: Snackbar message: "Cannot access upload page. Guest users have read-only access."
```

### 5. Test User Management Page
```
Navigate to: Admin → Add People (if accessible)
✅ Check: Yellow local banner: "You are in read-only mode. You cannot add, edit, or delete users."
✅ Check: "Add People" button is HIDDEN
✅ Check: In table, Actions column shows "View only" (no Edit/Delete buttons)
✅ Check: Can still view user list
✅ Check: Can still filter by role
✅ Check: Can still search users
```

### 6. Test Global Banner
```
Navigate between different pages:
✅ Check: Orange banner stays at top on ALL pages
✅ Check: Banner is sticky (stays visible when scrolling down)
✅ Check: On mobile (resize browser < 768px), banner text adjusts
```

### 7. Test Programmatic Protection (Edge Cases)
```
Open browser console (F12), try to trigger actions via console:
✅ Check: All TypeScript guards should catch and show snackbar
✅ Check: Backend should return 403 if somehow bypassed UI
```

## Visual Reference

### Expected UI States

#### Global Banner (Top of Every Page)
```
┌─────────────────────────────────────────────────────────────┐
│  👁️  You are browsing in READ-ONLY MODE as a Guest.        │
│      You cannot create, edit, or delete any data.          │
└─────────────────────────────────────────────────────────────┘
```
- Background: Orange gradient (#ffc107 → #ff9800)
- Text: White, uppercase "READ-ONLY MODE"
- Position: Sticky at top, always visible

#### Local Banner (Within Components)
```
┌─────────────────────────────────────────────────────────────┐
│  👁️  You are in read-only mode. You cannot create, edit,   │
│      or delete [resource].                                  │
└─────────────────────────────────────────────────────────────┘
```
- Background: Light yellow (#fff3cd)
- Text: Dark brown (#856404)
- Border-left: Yellow (#ffc107)

#### Cohort Card (Guest View)
```
┌──────────────────────────────────────────┐
│  👥 COHORT-2024-Q1                   ⋮  │  ← Three dots HIDDEN
│  ▫️ Engineering  ▫️ Full Stack  ▫️ FTE  │
│  📍 Bangalore  🎫 #12345                │
│  [ View details ]                        │  ← Only this button visible
└──────────────────────────────────────────┘
```

#### Learning Path Card (Guest View)
```
┌──────────────────────────────────────────┐
│  ⏰ 12 weeks                              │  ← No three dots menu
│  Full Stack Development                  │
│  [ View Details ]                        │  ← Only this button visible
└──────────────────────────────────────────┘
(No "Edit" button at bottom)
```

#### User Management Table (Guest View)
```
┌────┬──────────┬─────────────┬────────────────────┬────────────┬───────────┐
│ S# │ Dev ID   │ ID          │ Full Name          │ Email      │ Actions   │
├────┼──────────┼─────────────┼────────────────────┼────────────┼───────────┤
│ 1  │ 14321    │ EMP001      │ John Doe           │ john@...   │ View only │
│ 2  │ 21845    │ EMP002      │ Jane Smith         │ jane@...   │ View only │
└────┴──────────┴─────────────┴────────────────────┴────────────┴───────────┘
```
(No Edit/Delete icon buttons, just "View only" text)

## Common Issues to Check

### Issue: Buttons still visible
**Solution**: Check `*ngIf="!isReadOnly"` is present in HTML

### Issue: Banner not showing
**Solution**: Check `isReadOnly = StorageService.isReadOnly()` in ngOnInit()

### Issue: Can still click hidden buttons (programmatically)
**Expected**: Should show snackbar message and return early

### Issue: Global banner not sticky
**Solution**: Check CSS has `position: sticky; top: 0; z-index: 1000;`

## Browser Testing

Test in:
- ✅ Chrome
- ✅ Firefox  
- ✅ Safari
- ✅ Edge
- ✅ Mobile viewport (< 768px)

## Logout and Re-login

Test the full flow:
```
1. Login as Guest
2. Navigate around (verify restrictions)
3. Logout
4. Login as Admin (regular user)
5. ✅ Check: Banners should NOT appear
6. ✅ Check: All buttons should be visible
7. ✅ Check: Can create/edit/delete
```

## Performance Check

- ✅ Page load speed not affected
- ✅ No console errors
- ✅ No excessive re-renders
- ✅ Smooth navigation between pages

## Accessibility Check

- ✅ Banner has proper contrast (WCAG AA)
- ✅ Icons have proper aria-labels
- ✅ Keyboard navigation works
- ✅ Screen reader announces banners

---

## Quick Sign-Off Checklist

Before marking complete:
- [ ] Tested guest login flow
- [ ] Verified all 4 main components (Cohorts, Paths, Trainees, Users)
- [ ] Confirmed global banner on all pages
- [ ] Confirmed local banners on write-operation pages
- [ ] Tested programmatic guards (console checks)
- [ ] Verified backend still returns 403 for writes
- [ ] No TypeScript compilation errors
- [ ] No console errors during navigation
- [ ] Tested logout and re-login as regular user
- [ ] Mobile responsive (banner adjusts)

**All checks passed?** ✅ Guest UI restrictions are complete!
