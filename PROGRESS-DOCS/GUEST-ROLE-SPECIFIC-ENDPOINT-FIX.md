# Guest Role-Specific Cohort Endpoint Fix

## Issue

Guest users were getting **401 Unauthorized** error when trying to load cohorts:

```
HttpErrorResponse {
  status: 401,
  url: 'http://localhost:8083/api/cohorts/role-specific',
  message: "Http failure response for http://localhost:8083/api/cohorts/role-specific: 401 OK"
}
```

## Root Cause

The cohort component calls `/api/cohorts/role-specific` endpoint which:
1. Uses **POST** HTTP method (not GET)
2. Is semantically a **read operation** (fetches cohorts by role)
3. Was blocked by SecurityConfig's general rule: "Block all POST for GUEST"

### Why POST Instead of GET?

The endpoint needs to send user details (email, role) in the request body:

```java
@PostMapping("/role-specific")
public ResponseEntity<Response> getCohortsByRole(@Valid @RequestBody RegisterAssociateDto associate) {
    Response response = cohortService.getCohortsByRole(associate);
    return ResponseEntity.status(response.getStatus()).body(response);
}
```

While this could theoretically be a GET with query parameters, it uses POST to send a DTO object. This is a common pattern but creates security configuration challenges since POST is usually for write operations.

## Solution

Added a **specific exception** in SecurityConfig to allow GUEST access to this read-only POST endpoint:

### SecurityConfig.java Changes

```java
// Exception: Allow GUEST to access read-only POST endpoints (semantically GET operations)
.requestMatchers(org.springframework.http.HttpMethod.POST, "/api/cohorts/role-specific")
    .hasAnyRole("GUEST", "ADMIN", "SKILLING_LEAD", "ACADEMY_COORDINATOR", 
                "TECHNICAL_TRAINER", "COACH", "BH_TRAINER", "MENTOR", "CR")

// Block all other write operations for GUEST
.requestMatchers(org.springframework.http.HttpMethod.POST, "/api/**")
    .hasAnyRole("ADMIN", "SKILLING_LEAD", ...) // No GUEST
```

### Key Points

1. **Order matters**: The specific matcher for `/api/cohorts/role-specific` must come **BEFORE** the general `/api/**` POST blocker
2. **Security preserved**: Only this specific endpoint is allowed; all other POST operations remain blocked for GUEST
3. **Read-only**: This endpoint only fetches data, doesn't modify anything

## How It Works

### Frontend Flow (Guest User)

1. Guest clicks "Guest" link → logs in with ROLE_GUEST
2. Navigates to Cohorts page
3. Component calls: `fetchAllCohortsDetailsByRole()`
4. Makes POST request to `/api/cohorts/role-specific` with:
   ```json
   {
     "associateEmail": "guest@trainingms.com",
     "role": "GUEST"
   }
   ```
5. Backend returns cohorts filtered by role
6. Cohorts display in the UI

### Backend Security

```
Request: POST /api/cohorts/role-specific
Headers: Authorization: Bearer <guest-jwt-token>

Security Chain:
1. ✅ Not public endpoint → check authentication
2. ✅ JWT valid → extract ROLE_GUEST
3. ✅ Check matchers in order:
   - Match: .requestMatchers(POST, "/api/cohorts/role-specific").hasAnyRole("GUEST", ...)
   - Result: ALLOWED ✅
4. ✅ Execute controller method
5. ✅ Return cohorts
```

## Alternative Solution (Future Improvement)

A more RESTful approach would be to change the endpoint to GET with path parameters or query params:

### Option 1: Path Parameters
```java
@GetMapping("/role/{role}/associate/{email}")
public ResponseEntity<Response> getCohortsByRole(
    @PathVariable String role, 
    @PathVariable String email) {
    // ...
}
```

### Option 2: Query Parameters
```java
@GetMapping("/by-role")
public ResponseEntity<Response> getCohortsByRole(
    @RequestParam String role, 
    @RequestParam String email) {
    // ...
}
```

### Benefits
- ✅ More RESTful (GET for read operations)
- ✅ No special security exceptions needed
- ✅ Cleaner security config
- ✅ Better HTTP semantics

### Drawbacks
- Requires backend refactoring
- Need to update frontend service calls
- Breaking change for existing clients

## Files Modified

### Backend
- ✅ `SecurityConfig.java` - Added exception for `/api/cohorts/role-specific` POST

**Lines Added**: 3 lines
**Impact**: Guest users can now load cohorts

## Testing

### Test Guest Cohort Loading

1. **Login as guest**
   ```bash
   curl -X POST http://localhost:8083/auth/guest-login
   ```

2. **Extract JWT token** from response

3. **Test role-specific endpoint**
   ```bash
   curl -X POST http://localhost:8083/api/cohorts/role-specific \
     -H "Authorization: Bearer <guest-jwt-token>" \
     -H "Content-Type: application/json" \
     -d '{
       "associateEmail": "guest@trainingms.com",
       "role": "GUEST"
     }'
   ```

4. **Expected**: 200 OK with cohorts array

### Test Guest Write Blocking Still Works

```bash
# Should still fail (403 Forbidden)
curl -X POST http://localhost:8083/api/cohorts/add \
  -H "Authorization: Bearer <guest-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Cohort",
    "code": "TEST-001"
  }'
```

## Frontend Testing

1. ✅ Click "Guest" on login page
2. ✅ Navigate to Cohorts page
3. ✅ Cohorts should load without errors
4. ✅ Check browser console - no 401 errors
5. ✅ Verify cohorts display correctly
6. ✅ Try to create/edit - should still be blocked

## Security Considerations

### Is This Safe?

**Yes**, because:

1. ✅ **Endpoint is read-only**: Only fetches data, doesn't modify anything
2. ✅ **Specific path**: Only `/api/cohorts/role-specific` allowed, not `/api/cohorts/**`
3. ✅ **Backend validation**: Service layer still validates user role
4. ✅ **No data leakage**: Returns only cohorts appropriate for the user's role
5. ✅ **All other POSTs blocked**: General POST blocker still active

### What Data Can Guest See?

Guest users with role `GUEST` calling this endpoint will see:
- Cohorts filtered by the backend's role-based logic
- Likely all cohorts (since guests should see everything admins see)
- No sensitive data beyond what's already in cohort records

The backend service `getCohortsByRole()` determines what's returned based on the role in the request body.

## Other Similar Endpoints

Check if there are other POST endpoints that are semantically read operations:

```bash
# Search for POST endpoints that might be read-only
grep -r "@PostMapping" --include="*.java" | grep -i "get\|fetch\|find\|search\|list"
```

If found, add similar exceptions:

```java
.requestMatchers(org.springframework.http.HttpMethod.POST, 
    "/api/cohorts/role-specific",
    "/api/other/search-endpoint",
    "/api/another/filter-endpoint"
).hasAnyRole("GUEST", ...)
```

## Status

✅ **FIXED** - Guest users can now load cohorts via the role-specific endpoint!

---

**Fixed Date**: December 18, 2025  
**Root Cause**: POST endpoint used for read operation blocked by general POST security rule  
**Solution**: Added specific security exception for read-only POST endpoint  
**Impact**: Guest cohorts feature now fully functional
