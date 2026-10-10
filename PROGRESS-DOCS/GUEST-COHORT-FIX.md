# Guest Cohort Loading Fix - Summary

## Issue
Guest users could login and see the sidebar, but cohorts (and other data) were not loading. The API requests were returning **403 Forbidden** errors.

## Root Cause
The SecurityConfig had a configuration issue with matcher precedence:

1. **General GET rule** allowed GUEST access to `/api/**`
2. **Specific role matchers** (e.g., `/api/admin/**`, `/api/trainee/**`) were configured WITHOUT HTTP method specification
3. These specific matchers matched **ALL HTTP methods** (including GET)
4. Spring Security evaluates matchers in order, and specific path matchers take precedence
5. Result: GUEST users were blocked by the specific matchers even though they should have GET access

### Example of the Problem

```java
// This allowed GUEST GET access (line 74)
.requestMatchers(HttpMethod.GET, "/api/**").hasAnyRole("GUEST", "ADMIN", ...)

// But this blocked ALL methods including GET (line 84)
.requestMatchers("/api/admin/**").hasRole("ADMIN")  // ❌ Blocks GET too!
```

When a guest user tried to access `/api/cohorts/all-cohorts` or `/api/admin/cohorts`, the more specific matcher without HTTP method specification would match first and block the request.

## Solution

Modified **SecurityConfig.java** to make all role-specific matchers **method-specific** (POST/PUT/DELETE only), allowing the general GET rule to work for GUEST users.

### Changes Made

#### Before (Blocking GUEST)
```java
// Blocked ALL HTTP methods for non-admins
.requestMatchers("/api/admin/**").hasRole("ADMIN")
.requestMatchers("/api/trainee/**").hasAnyRole("ACADEMY_COORDINATOR", "ADMIN")
// etc...
```

#### After (Allowing GUEST GET)
```java
// Only block write operations, GET is handled by the general rule above
.requestMatchers(HttpMethod.POST, "/api/admin/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.PUT, "/api/admin/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/api/admin/**").hasRole("ADMIN")

.requestMatchers(HttpMethod.POST, "/api/trainee/**").hasAnyRole("ACADEMY_COORDINATOR", "ADMIN")
.requestMatchers(HttpMethod.PUT, "/api/trainee/**").hasAnyRole("ACADEMY_COORDINATOR", "ADMIN")
.requestMatchers(HttpMethod.DELETE, "/api/trainee/**").hasAnyRole("ACADEMY_COORDINATOR", "ADMIN")
// etc...
```

### Complete List of Fixed Matchers

1. ✅ `/api/admin/**` - Now only POST/PUT/DELETE require ADMIN
2. ✅ `/api/skilling-lead/**` - Now only POST/PUT/DELETE require SKILLING_LEAD
3. ✅ `/api/academic-coordinator/**` - Now only POST/PUT/DELETE require ACADEMY_COORDINATOR
4. ✅ `/api/tech-trainer/**` - Now only POST/PUT/DELETE require TECHNICAL_TRAINER
5. ✅ `/api/coach/**` - Now only POST/PUT/DELETE require COACH
6. ✅ `/api/bh-trainer/**` - Now only POST/PUT/DELETE require BH_TRAINER
7. ✅ `/api/mentor/**` - Now only POST/PUT/DELETE require MENTOR
8. ✅ `/api/cr/**` - Now only POST/PUT/DELETE require CR
9. ✅ `/api/trainee/**` - Now only POST/PUT/DELETE require ACADEMY_COORDINATOR/ADMIN
10. ✅ `/api/events/**` - Added GUEST to GET requests explicitly

### Security Configuration Order (Correct)

```java
.authorizeHttpRequests(authorizeRequests ->
    authorizeRequests
        // 1. Public endpoints (no auth)
        .requestMatchers("/auth/**").permitAll()
        .requestMatchers("/swagger-ui/**").permitAll()
        
        // 2. GUEST READ ACCESS - Most permissive GET rule (MUST BE BEFORE specific matchers)
        .requestMatchers(HttpMethod.GET, "/api/**")
            .hasAnyRole("GUEST", "ADMIN", "SKILLING_LEAD", ...)
        
        // 3. Block ALL write operations from GUEST
        .requestMatchers(HttpMethod.POST, "/api/**")
            .hasAnyRole("ADMIN", "SKILLING_LEAD", ...) // No GUEST
        .requestMatchers(HttpMethod.PUT, "/api/**")
            .hasAnyRole("ADMIN", "SKILLING_LEAD", ...) // No GUEST
        .requestMatchers(HttpMethod.DELETE, "/api/**")
            .hasAnyRole("ADMIN", "SKILLING_LEAD", ...) // No GUEST
        
        // 4. Specific path + method matchers (more restrictive)
        .requestMatchers(HttpMethod.POST, "/api/admin/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/admin/**").hasRole("ADMIN")
        // etc...
        
        // 5. Catch-all
        .anyRequest().authenticated()
)
```

## Files Modified

### Backend
- ✅ `SecurityConfig.java` - Fixed all role-specific matchers to be HTTP method-specific

**Lines Changed**: ~60 lines
**Impact**: All role-specific endpoints now properly allow GUEST GET access

## Result

✅ **Guest users can now**:
- Load cohorts (`GET /api/cohorts/all-cohorts`)
- View cohort details (`GET /api/cohorts/{id}`)
- Load trainees (`GET /api/trainee/**`)
- View learning paths (`GET /api/learning-path/**`)
- Access all admin pages (`GET /api/admin/**`)
- View events (`GET /api/events/**`)
- Load all dashboard data

❌ **Guest users still CANNOT**:
- Create cohorts (`POST /api/cohorts/add`) - 403 Forbidden ✓
- Update cohorts (`PUT /api/cohorts/update/{id}`) - 403 Forbidden ✓
- Delete cohorts (`DELETE /api/cohorts/delete/{id}`) - 403 Forbidden ✓
- Any POST/PUT/DELETE operation - 403 Forbidden ✓

## Testing

### Test Guest GET Access
```bash
# Login as guest
curl -X POST http://localhost:8083/auth/guest-login

# Extract JWT token from response
# Then test GET requests

# Should work (200 OK)
curl -X GET http://localhost:8083/api/cohorts/all-cohorts \
  -H "Authorization: Bearer <guest-jwt-token>"

# Should work (200 OK)
curl -X GET http://localhost:8083/api/trainee/all \
  -H "Authorization: Bearer <guest-jwt-token>"

# Should work (200 OK)
curl -X GET http://localhost:8083/api/admin/dashboard \
  -H "Authorization: Bearer <guest-jwt-token>"
```

### Test Guest Write Blocking
```bash
# Should fail (403 Forbidden)
curl -X POST http://localhost:8083/api/cohorts/add \
  -H "Authorization: Bearer <guest-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Cohort"}'

# Should fail (403 Forbidden)
curl -X PUT http://localhost:8083/api/cohorts/update/1 \
  -H "Authorization: Bearer <guest-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated"}'

# Should fail (403 Forbidden)
curl -X DELETE http://localhost:8083/api/cohorts/delete/1 \
  -H "Authorization: Bearer <guest-jwt-token>"
```

## Key Takeaway

**Spring Security Matcher Order Matters!**

When configuring HTTP security:
1. **Most specific** matchers should come **first** (specific path + specific method)
2. **General** matchers should come **after** (wildcard paths or all methods)
3. **Method-specific** matchers (GET, POST, etc.) are more specific than path-only matchers

In our case:
- `HttpMethod.GET, "/api/**"` + roles = General GET rule for GUEST
- `HttpMethod.POST, "/api/admin/**"` + admin role = Specific write rule
- `"/api/admin/**"` + admin role = TOO GENERAL, blocks GET too! ❌

## Deployment

### Build & Deploy
```bash
# Backend
cd "Genc Training Portal Server"
mvn clean package
# Deploy to Render

# Frontend (no changes needed)
# Just redeploy if needed
```

### Verification Steps
1. ✅ Login as guest via frontend
2. ✅ Check browser console for any 403 errors
3. ✅ Navigate to Cohorts page - should load data
4. ✅ Navigate to Learning Paths - should load data
5. ✅ Try to create/edit - should show read-only message

## Status
✅ **FIXED** - Guest users can now load all data via GET requests while write operations remain blocked!

---

**Fixed Date**: December 18, 2025  
**Files Modified**: 1 (SecurityConfig.java)  
**Root Cause**: HTTP method matcher specificity issue  
**Impact**: All endpoints now accessible for GUEST read access
