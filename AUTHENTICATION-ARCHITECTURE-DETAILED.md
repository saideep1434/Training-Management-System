# 🔐 Complete Authentication Architecture Deep-Dive

**Date**: May 14, 2026  
**System**: Training Management System  
**Architecture Type**: JWT Token-Based Stateless Authentication

---

## 📋 Table of Contents

1. [High-Level Architecture Overview](#high-level-architecture-overview)
2. [Step-by-Step Authentication Flow](#step-by-step-authentication-flow)
3. [Algorithms Used & Why](#algorithms-used--why)
4. [Component Breakdown](#component-breakdown)
5. [Data Structures](#data-structures)
6. [Security Features](#security-features)
7. [Every Minute Detail](#every-minute-detail)

---

## High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. Login Component → Captures credentials                │  │
│  │ 2. AuthService → Makes HTTP request to backend           │  │
│  │ 3. StorageService → Stores JWT token in localStorage     │  │
│  │ 4. AuthInterceptor → Adds token to every HTTP request    │  │
│  │ 5. AuthGuard → Protects routes based on roles            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           ↓ HTTP Request ↓
                     Authorization: Bearer {JWT}
                           ↓ HTTP Response ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. LoginController → Receives credentials                │  │
│  │ 2. AuthenticationManager → Validates against database    │  │
│  │ 3. JwtTokenProvider → Generates signed JWT token         │  │
│  │ 4. JwtAuthenticationFilter → Validates JWT on requests   │  │
│  │ 5. SecurityConfig → Enforces role-based access control   │  │
│  │ 6. CustomUserDetailsService → Loads user from database   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           ↓ Database ↓
                    register_associate table
                    (stores users & encrypted passwords)
```

---

## Step-by-Step Authentication Flow

### **Phase 1: Login (Initial Authentication)**

```
1. USER ENTERS CREDENTIALS
   └─ Frontend: side-login.component.ts collects email & password

2. FRONTEND SENDS LOGIN REQUEST
   └─ POST http://localhost:8083/auth/login
   └─ Body: { username: "user@example.com", password: "password123" }
   └─ No Authorization header needed (login is public)

3. BACKEND RECEIVES REQUEST
   └─ LoginController.login() method is invoked
   └─ Request routing: @PostMapping("/auth/login")

4. AUTHENTICATION MANAGER VALIDATES CREDENTIALS
   └─ AuthenticationManager.authenticate(Authentication)
   └─ Delegates to: CustomUserDetailsService.loadUserByUsername()
   
5. DATABASE LOOKUP
   └─ CustomUserDetailsService queries: register_associate table
   └─ Retrieves: email, BCrypt-hashed password, role
   
6. PASSWORD VERIFICATION
   └─ BCryptPasswordEncoder.matches(plainText, hashedPassword)
   └─ If match → Authentication succeeds
   └─ If no match → AuthenticationException is thrown

7. JWT GENERATION
   └─ JwtTokenProvider.generateToken(Authentication auth)
   └─ Creates JWT with claims: username, roles, timestamp
   └─ Signs with HMAC-SHA256 algorithm
   
8. RESPONSE SENT TO FRONTEND
   └─ HTTP 200 OK
   └─ Body: {
         "success": "true",
         "message": "Login successful",
         "username": "user@example.com",
         "roles": ["ADMIN", "SKILLING_LEAD"],
         "jwtToken": "eyJhbGc...",  ← JWT Token
         "associateId": "12345"
      }

9. FRONTEND STORES TOKEN & USER DATA
   └─ StorageService.saveUser() stores entire response
   └─ localStorage key: "attendance_user"
   └─ Data persists even after page refresh

10. FRONTEND NAVIGATES TO DASHBOARD
    └─ Based on user's role, routes to appropriate page
    └─ Role-to-Route mapping:
       ├─ ADMIN → /admin
       ├─ SKILLING_LEAD → /skilling-lead
       ├─ ACADEMY_COORDINATOR → /academic-coordinator
       └─ TECHNICAL_TRAINER → /tech-trainer
        ... (8 total roles)
```

### **Phase 2: Subsequent Requests (Token Validation)**

```
1. USER NAVIGATES TO PROTECTED PAGE
   └─ Angular route: /api/admin/associates
   └─ Component needs data → calls admin.service.ts

2. HTTP REQUEST IS MADE
   └─ admin.service.ts makes: GET /api/admin/associates
   └─ Request interceptor kicks in

3. AUTHINTERCEPTOR INTERCEPTS REQUEST
   └─ AuthInterceptor.intercept() is invoked
   └─ Reads token from: StorageService.getToken()
   └─ Extracts JWT from localStorage["attendance_user"].jwtToken
   └─ Clones request with new Authorization header
   └─ Modified request: 
       GET /api/admin/associates
       Authorization: Bearer eyJhbGc...

4. BACKEND RECEIVES AUTHENTICATED REQUEST
   └─ Request hits Spring Security filter chain
   └─ JwtAuthenticationFilter.doFilterInternal() is called

5. JWT VALIDATION
   └─ JwtAuthenticationFilter extracts "Bearer " token
   └─ JwtTokenProvider.validateToken(token) checks:
       ├─ Signature is valid (HMAC-SHA256 verification)
       ├─ Token is not expired (checks expiration claim)
       ├─ Token format is correct (JwtException handling)
   
6. CLAIMS EXTRACTION
   └─ If token is valid:
       ├─ JwtTokenProvider.getUsernameFromJwt() → "user@example.com"
       ├─ JwtTokenProvider.getRolesFromJwt() → ["ADMIN", "SKILLING_LEAD"]

7. SECURITY CONTEXT SETUP
   └─ Creates UsernamePasswordAuthenticationToken
   └─ Sets Principal: username string
   └─ Sets Credentials: null (already validated)
   └─ Sets Authorities: [SimpleGrantedAuthority("ADMIN"), ...]
   └─ SecurityContextHolder.getContext().setAuthentication(auth)

8. AUTHORIZATION CHECK
   └─ SecurityConfig checks: is user authorized for this endpoint?
   └─ Rule: GET /api/admin/** requires hasRole("ADMIN")
   └─ Check: Does user have ADMIN role?
       ├─ YES → Request proceeds
       ├─ NO → 403 Forbidden returned

9. ENDPOINT PROCESSES REQUEST
   └─ Controller method executes
   └─ Database queries are performed
   └─ Response is returned to frontend

10. FRONTEND RECEIVES RESPONSE
    └─ AuthInterceptor passes through (no modification for response)
    └─ Component receives data
    └─ UI is updated
```

### **Phase 3: Logout**

```
1. USER CLICKS LOGOUT
   └─ Calls AuthService.logout()

2. STORAGE IS CLEARED
   └─ StorageService.signOut()
   └─ localStorage["attendance_user"] is deleted
   └─ JWT token is discarded

3. USER IS REDIRECTED
   └─ Router.navigate(['/authentication/login'])
   └─ User is sent back to login page

4. SUBSEQUENT REQUESTS FAIL
   └─ AuthInterceptor cannot find token
   └─ Requests are sent without Authorization header
   └─ Backend returns 401 Unauthorized
   └─ (Note: Token is not invalidated on backend - it expires naturally)
```

---

## Algorithms Used & Why

### **1. 🔒 Password Hashing: BCrypt**

#### **Algorithm Details**

```
BCrypt Algorithm: Blowfish Cipher Variant
Cost Factor: 10 (default)
Salt: Automatically generated and included in hash
Output Format: $2a$10$... (or $2b$, $2y$)
```

#### **Why BCrypt?**

| Aspect | Why BCrypt | Alternative | Why Not |
|--------|-----------|-------------|---------|
| **Slow by Design** | Takes ~100ms per hash | MD5 (instant) | Fast = vulnerable to brute force |
| **Adaptive Cost** | Cost factor can increase over time | SHA256 (fixed) | No way to increase difficulty |
| **Salt Included** | Prevents rainbow table attacks | Plain SHA | Rainbow tables beat SHA |
| **Industry Standard** | Used by 99% of companies | PBKDF2 | Also good, but BCrypt preferred |
| **Hardware Resistant** | Can't be accelerated by GPU/ASIC | Scrypt/Argon2 | Better, but BCrypt sufficient |

#### **Implementation in Your Code**

```java
// File: SecurityConfig.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();  // Cost factor = 10 (default)
}

// During Login
AuthenticationManager.authenticate(auth);
// ↓ Delegates to CustomUserDetailsService
// ↓ Calls BCryptPasswordEncoder.matches(rawPassword, hashedPassword)
// ↓ Returns true/false based on comparison
```

#### **BCrypt Hash Format Breakdown**

```
$2a$10$... = BCrypt hash
 └─┘ └──┘
  │   └─ Cost factor (10 = 2^10 iterations)
  └─ Algorithm version (2a = original BCrypt)

Example hash:
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWDeBlkxiRlO.J4m

Total length: 60 characters (always)
```

#### **Why Not Other Algorithms?**

| Algorithm | Issue |
|-----------|-------|
| **MD5** | Cryptographically broken, unsalted |
| **SHA1/SHA256** | Fast, no salt by default, weak against GPU |
| **PBKDF2** | Good, but requires more configuration |
| **Scrypt** | Better than BCrypt, but slower/more complex |
| **Argon2** | Best, but requires additional dependency |

**Your system chose BCrypt because**: Easy to use, industry standard, sufficient security, well-tested.

---

### **2. 🔑 Token Generation & Signing: HMAC-SHA256 (HS256)**

#### **Algorithm Details**

```
JWT (JSON Web Token) Structure:
[Header].[Payload].[Signature]

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiQURNSU4iXSwiaWF0IjoxNjI2MzU0NTI1fQ.
zevKc6P4kJCUX5L8Ht3Q9j0X7Y2M5N3O1P2Q5R6S
```

#### **Header (Base64-Decoded)**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### **Payload (Base64-Decoded)**

```json
{
  "sub": "user@example.com",           ← Subject (username)
  "roles": ["ADMIN", "SKILLING_LEAD"], ← Custom claim
  "iat": 1626354525,                   ← Issued At (timestamp)
  "exp": 1626441125                    ← Expiration (24 hours later)
}
```

#### **Signature Generation**

```
HMACSHA256(
  Base64Url(header) + "." + Base64Url(payload),
  jwtSecret
) = signature

Example secret: 
yourVeryStrongAndSecureSecretKeyForJWTAuthenticationWhichShouldBeLongerThan256Bits
```

#### **Implementation in Your Code**

```java
// File: JwtTokenProvider.java

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")  // 256-bit base64 encoded secret
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")  // 86400000ms = 24 hours
    private int jwtExpirationMs;

    private Key key() {
        // Decodes base64 secret to 256-bit key
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())           // "user@example.com"
                .claim("roles", roles)                             // ["ADMIN", "SKILLING_LEAD"]
                .setIssuedAt(new Date())                           // Current timestamp
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))  // +24h
                .signWith(key(), SignatureAlgorithm.HS256)         // Sign with HMAC-SHA256
                .compact();                                         // Create final JWT string
    }
}
```

#### **Token Validation Process**

```java
public boolean validateToken(String authToken) {
    try {
        Jwts.parserBuilder()
            .setSigningKey(key())              // Use same secret key
            .build()
            .parse(authToken);                 // Verify signature + expiration
        return true;
    } catch (MalformedJwtException e) {        // Invalid structure
        logger.error("Invalid JWT token");
    } catch (ExpiredJwtException e) {          // Token expired
        logger.error("JWT token is expired");
    } catch (UnsupportedJwtException e) {      // Wrong algorithm
        logger.error("JWT token is unsupported");
    } catch (IllegalArgumentException e) {     // Empty token
        logger.error("JWT claims string is empty");
    }
    return false;
}
```

#### **Why HMAC-SHA256 (HS256)?**

| Aspect | HS256 | RSA (RS256) | EdDSA |
|--------|-------|-----------|-------|
| **Signing Speed** | ⚡ Fast | Slower | Fastest |
| **Verification Speed** | ⚡ Fast | Slower | Fast |
| **Key Size** | 256 bits | 2048+ bits | 256 bits |
| **Complexity** | Simple | Complex (public/private key) | Complex |
| **Microservices** | ✅ Good (shared secret) | ✅ Better (public key) | ✅ Better |
| **Security** | ✅ Excellent (with strong secret) | ✅ Excellent | ✅ Excellent |

**Your system chose HS256 because**:
- Simple implementation
- Fast signing and verification
- Sufficient for monolithic architecture
- All services share same secret

**When to upgrade to RS256**:
- Microservices with separate deployment
- Multiple backend services
- Need public key verification without secret

---

### **3. 📊 Session Management: Stateless (No Session Storage)**

#### **Traditional Session-Based (❌ NOT USED)**

```
Client Request:
  POST /login → {"username": "user", "password": "pass"}

Server Response:
  Set-Cookie: SESSIONID=abc123xyz789
  { "success": true }

Client stores SESSIONID in cookies
On next request:
  GET /api/data
  Cookie: SESSIONID=abc123xyz789

Server:
  Looks up session in memory/Redis
  { username: "user", roles: ["ADMIN"] }
  Returns data
```

#### **JWT-Based Stateless (✅ YOUR SYSTEM)**

```
Client Request:
  POST /login → {"username": "user", "password": "pass"}

Server Response:
  { 
    "jwtToken": "eyJhbGc...",
    "username": "user",
    "roles": ["ADMIN"]
  }

Client stores JWT in localStorage
On next request:
  GET /api/data
  Authorization: Bearer eyJhbGc...

Server:
  Validates JWT signature with secret
  Extracts claims from JWT
  No database lookup needed!
  Returns data
```

#### **Why Stateless?**

| Advantage | Why It Matters |
|-----------|----------------|
| **No Session Storage** | Reduce memory usage on server |
| **Horizontal Scalability** | Any server can validate token (no session affinity) |
| **No Session Fixation** | No sessions to hijack |
| **CORS Friendly** | Works across different domains |
| **Mobile Friendly** | Works with native apps, SPAs |
| **No Session Timeout** | Token expiration handled by expiry time |

#### **Implementation in Your Code**

```java
// File: SecurityConfig.java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.sessionManagement(session -> session
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // ← No sessions
    );
    // ...
}

// Result: Spring doesn't create HttpSession
// No JSESSIONID cookie
// Requests are stateless and scalable
```

---

## Component Breakdown

### **Backend Components**

#### **1. SecurityConfig.java**

**Purpose**: Defines authentication rules and security filter chain

**Key Parts**:

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Enables @PreAuthorize annotations
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. CSRF DISABLED for stateless APIs
            .csrf(csrf -> csrf.disable())
            
            // 2. CORS ENABLED
            .cors(withDefaults())
            
            // 3. EXCEPTION HANDLING (return 401 for unauthenticated)
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            
            // 4. SESSION MANAGEMENT (stateless with JWT)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 5. AUTHORIZATION RULES
            .authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                    .requestMatchers("/auth/**").permitAll()      // Login is public
                    .requestMatchers(GET, "/api/**").hasAnyRole(...)  // Reads allowed for multiple roles
                    .requestMatchers(POST, "/api/**").hasAnyRole(...) // Writes restricted
                    .anyRequest().authenticated()                  // Default: require auth
            )
            
            // 6. JWT FILTER (runs before Spring's default filters)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

**Flow**:
1. Request comes in
2. Spring Security filter chain processes it
3. JwtAuthenticationFilter validates JWT
4. SecurityConfig checks if user is authorized for endpoint
5. If authorized, request proceeds
6. If not, 403 Forbidden returned

---

#### **2. JwtTokenProvider.java**

**Purpose**: Create, validate, and extract information from JWT tokens

**Key Methods**:

```java
public String generateToken(Authentication authentication) {
    // Called after user logs in successfully
    // Creates JWT with username, roles, timestamps
    // Returns signed JWT string
}

public boolean validateToken(String authToken) {
    // Called for every authenticated request
    // Verifies signature, expiration, format
    // Returns true/false
}

public String getUsernameFromJwt(String token) {
    // Extracts the "sub" (subject) claim
    // Returns username like "user@example.com"
}

public List<String> getRolesFromJwt(String token) {
    // Extracts the "roles" custom claim
    // Returns ["ADMIN", "SKILLING_LEAD"]
}
```

**Every Minute Detail**:

```java
private Key key() {
    // Step 1: Get secret from properties: "yourVeryStrongAndSecureSecret..."
    // Step 2: Base64 decode it to bytes
    // Step 3: Create HMAC-SHA256 key from bytes
    // Why? JJWT library needs Key object for signing/validation
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
}

public String generateToken(Authentication authentication) {
    UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

    // Step 1: Extract roles from authentication object
    List<String> roles = userPrincipal.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)  // "ROLE_ADMIN" → "ADMIN"
            .collect(Collectors.toList());

    // Step 2: Build JWT
    return Jwts.builder()
            .setSubject(userPrincipal.getUsername())  // Claim: who (username)
            .claim("roles", roles)                     // Custom claim: what roles
            .setIssuedAt(new Date())                   // Claim: when issued (now)
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))  // Expires in 24h
            .signWith(key(), SignatureAlgorithm.HS256) // Claim: signature (proof)
            .compact();                                 // Step 3: Encode as string
}
```

---

#### **3. JwtAuthenticationFilter.java**

**Purpose**: Intercepts every HTTP request and validates JWT token

**Flow**:

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // Extends OncePerRequestFilter = runs exactly once per request

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) {
        
        // Step 1: Get Authorization header
        String bearerToken = request.getHeader("Authorization");
        // Example: "Bearer eyJhbGc..."

        // Step 2: Extract JWT from "Bearer " prefix
        String jwt = null;
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            jwt = bearerToken.substring(7);  // Remove "Bearer "
        }

        // Step 3: Validate JWT signature & expiration
        if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
            
            // Step 4: Extract claims
            String username = jwtTokenProvider.getUsernameFromJwt(jwt);
            List<String> roles = jwtTokenProvider.getRolesFromJwt(jwt);
            
            // Step 5: Convert roles to authorities
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(SimpleGrantedAuthority::new)  // "ADMIN" → GrantedAuthority
                    .collect(Collectors.toList());

            // Step 6: Create Authentication object
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(
                    username,      // Principal
                    null,          // Credentials (no password for JWT)
                    authorities    // Authorities (roles)
                );

            // Step 7: Set request details (for audit logging)
            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
            );

            // Step 8: Put authentication in SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);
            // ← Now Spring Security knows who this user is
        }

        // Step 9: Continue with filter chain (go to next filter/endpoint)
        filterChain.doFilter(request, response);
    }
}
```

**Key Points**:
- Runs for **every** HTTP request
- If no valid JWT → user is unauthenticated
- If valid JWT → user is authenticated with extracted roles
- No database lookup needed (stateless validation)

---

#### **4. CustomUserDetailsService.java**

**Purpose**: Load user details from database during login

**When It's Called**:
1. User submits login form
2. AuthenticationManager calls this service
3. Service queries database
4. Returns UserDetails object with password

**Flow**:

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Step 1: Query database
        RegisterAssociate user = repository.findByAssociateEmail(username);
        
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        // Step 2: Extract roles
        String role = user.getRole();  // e.g., "ADMIN"
        
        // Step 3: Create GrantedAuthority objects
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));  // "ROLE_ADMIN"

        // Step 4: Create UserDetails object
        return User.builder()
                .username(user.getAssociateEmail())              // username for login
                .password(user.getPassword())                    // BCrypt-hashed password
                .authorities(authorities)                        // roles
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
```

**Key Points**:
- Only called during **login**
- Retrieves user from database
- Compares passwords (BCrypt)
- Returns authorities for JWT generation

---

### **Frontend Components**

#### **1. AuthService.ts**

**Purpose**: Handle login/logout and authentication state

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
    baseUrl = `${environment.apiBaseUrl.replace('/api', '')}/auth`;

    constructor(private http: HttpClient, private router: Router) { }

    login(username: string, password: string): Observable<LoginResponse> {
        // Step 1: POST credentials to backend
        return this.http.post<LoginResponse>(
            this.baseUrl + '/login', 
            { username, password }
        ).pipe(
            // Step 2: On success, save user to localStorage
            tap((response: LoginResponse) => {
                StorageService.saveUser(response);
            })
        );
    }

    logout(): void {
        // Step 1: Clear localStorage
        StorageService.signOut();
        // Step 2: Redirect to login
        this.router.navigate(['/authentication/login']);
    }

    isLoggedIn(): boolean {
        // Check if user is stored in localStorage
        return StorageService.getUser() !== null;
    }

    hasRole(requiredRole: string): boolean {
        // Check if current user has specific role
        const user = StorageService.getUser();
        return user && user.roles && user.roles.includes(requiredRole);
    }

    hasAnyRole(requiredRoles: string[]): boolean {
        // Check if user has ANY of the required roles
        const user = StorageService.getUser();
        return requiredRoles.some(role => user.roles.includes(role));
    }
}
```

---

#### **2. AuthInterceptor.ts**

**Purpose**: Add JWT token to every HTTP request automatically

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Step 1: Get JWT token from localStorage
        const token = StorageService.getToken();

        // Step 2: If token exists, clone request with Authorization header
        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(cloned);
        }

        // Step 3: If no token, send request as-is
        return next.handle(req);
    }
}
```

**Every Minute Detail**:
- Runs before **every** HTTP request
- Gets token from: `localStorage['attendance_user'].jwtToken`
- Adds header: `Authorization: Bearer eyJhbGc...`
- Doesn't modify response (just passes through)
- Registered in `app.config.ts` with `HTTP_INTERCEPTORS` provider

---

#### **3. StorageService.ts**

**Purpose**: Manage JWT token and user data in localStorage

```typescript
export class StorageService {
    private static readonly USER_KEY = "attendance_user";

    static saveUser(user: LoginResponse): void {
        // Save entire response object for later use
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    static getUser(): LoginResponse | null {
        // Retrieve and parse user object
        const user = localStorage.getItem(this.USER_KEY);
        if (!user) return null;
        
        try {
            return JSON.parse(user);
        } catch (error) {
            console.error("Error parsing user data", error);
            return null;
        }
    }

    static getToken(): string | null {
        // Extract just the JWT token for Authorization header
        const user = this.getUser();
        return user ? user.jwtToken : null;
    }

    static signOut(): void {
        // Clear all stored user data
        localStorage.removeItem(this.USER_KEY);
    }

    static hasRole(role: string): boolean {
        // Check if current user has role
        const user = this.getUser();
        return user && user.roles && user.roles.includes(role);
    }
}
```

**Data Stored** (example):
```json
localStorage["attendance_user"] = {
  "success": "true",
  "message": "Login successful",
  "username": "user@example.com",
  "roles": ["ADMIN", "SKILLING_LEAD"],
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "associateId": "12345"
}
```

---

#### **4. AuthGuard.ts**

**Purpose**: Protect routes - prevent unauthorized navigation

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        // Step 1: Check if user is logged in
        if (this.authService.isLoggedIn()) {
            // Step 2: Get required roles from route data
            const requiredRoles = route.data['roles'];

            // Step 3: Check if user has required roles
            if (!requiredRoles || this.authService.hasAnyRole(requiredRoles)) {
                return true;  // ✅ Allow navigation
            }

            console.warn("User lacks required roles");
            this.router.navigate(['/unauthorized']);
            return false;
        }

        // ❌ Not logged in
        console.warn("User not authenticated");
        this.router.navigate(['/authentication/login']);
        return false;
    }
}
```

**Applied to Routes**:
```typescript
{
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'ACADEMY_COORDINATOR', 'GUEST'] }  // Required roles
}
```

---

## Data Structures

### **LoginResponse (Backend → Frontend)**

```typescript
export interface LoginResponse {
  success: string;                    // "true"
  message: string;                    // "Login successful"
  username: string;                   // "user@example.com"
  roles: string[];                    // ["ADMIN", "SKILLING_LEAD"]
  jwtToken: string;                   // "eyJhbGc..."
  associateId?: string;               // "12345" (optional)
}
```

### **JWT Payload Structure**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
.
{
  "sub": "user@example.com",
  "roles": ["ADMIN", "SKILLING_LEAD"],
  "iat": 1626354525,
  "exp": 1626441125
}
.
[signature]
```

### **SecurityContext (After JWT Validation)**

```java
UsernamePasswordAuthenticationToken {
    principal: "user@example.com",
    credentials: null,
    authorities: [
        SimpleGrantedAuthority("ADMIN"),
        SimpleGrantedAuthority("SKILLING_LEAD")
    ]
}
```

---

## Security Features

### **1. Password Security**

| Layer | Mechanism |
|-------|-----------|
| **Storage** | BCrypt hashing (10 rounds) |
| **Comparison** | BCryptPasswordEncoder.matches() |
| **Migration** | Automatic detection & upgrade on startup |
| **Verification** | Timing-safe comparison (prevents timing attacks) |

### **2. Token Security**

| Layer | Mechanism |
|-------|-----------|
| **Signing** | HMAC-SHA256 with 256-bit secret |
| **Verification** | Signature validation on every request |
| **Expiration** | 24 hours (configurable) |
| **Transport** | Authorization header (not cookie) |
| **Storage** | localStorage (vulnerable to XSS) |

### **3. Authentication Security**

| Layer | Mechanism |
|-------|-----------|
| **Credentials** | Username + Password |
| **Password Validation** | BCrypt comparison |
| **Session** | Stateless (no session fixation) |
| **Failure Handling** | Logged but no user enumeration |

### **4. Authorization Security**

| Layer | Mechanism |
|-------|-----------|
| **Role-Based** | 8 distinct roles with permissions |
| **Method-Level** | @PreAuthorize annotations |
| **HTTP Methods** | GET, POST, PUT, DELETE restrictions |
| **Endpoint-Level** | SecurityConfig matchers |

### **5. CSRF Protection**

```
Status: DISABLED (correct for stateless APIs)

Reason: CSRF attacks require:
  1. Session cookies (you don't have them)
  2. Browser auto-inclusion of cookies (you use headers)
  3. No CORS (you have CORS restrictions)
  
If using cookies, you would need CSRF tokens
Since you use JWT headers → CSRF impossible
```

### **6. CORS Security**

```java
// WebConfig.java
registry.addMapping("/api/**")
    .allowedOrigins("http://localhost:4200")  // Specific origins only
    .allowedMethods("GET", "POST", "PUT", "DELETE")
    .allowedHeaders("*")
    .allowCredentials(true)
    .maxAge(3600);
```

**Why This Matters**:
- Only specific origins can call your API
- Prevents requests from malicious websites
- Browser enforces it (called Same-Origin Policy)

---

## Every Minute Detail

### **Detail 1: JWT Secret Base64 Encoding**

```
Raw secret: yourVeryStrongAndSecureSecretKeyForJWTAuthenticationWhichShouldBeLongerThan256Bits

Why Base64?
  - JJWT library expects bytes, not strings
  - Base64 safely encodes arbitrary bytes
  - Decoders.BASE64.decode() converts back

In SecurityConfig.java:
  Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret))
                     └─ Converts "abc123..." → [bytes]
                                                └─ Creates Key object
```

### **Detail 2: Role Prefix Addition**

```java
// In CustomUserDetailsService:
SimpleGrantedAuthority("ROLE_" + role)
                        └─ Adds "ROLE_" prefix

Example:
  Database: role = "ADMIN"
  Authority: "ROLE_ADMIN"
  
Why?
  Spring Security convention expects "ROLE_" prefix
  SecurityConfig checks: hasRole("ADMIN")
  Matches: "ROLE_ADMIN" (Spring strips "ROLE_" when checking)
```

### **Detail 3: Token Extraction from Header**

```java
String bearerToken = request.getHeader("Authorization");
// Expected: "Bearer eyJhbGc..."

if (bearerToken.startsWith("Bearer ")) {
    jwt = bearerToken.substring(7);  // Remove "Bearer "
}
// Result: "eyJhbGc..."
```

### **Detail 4: SecurityContextHolder Usage**

```java
// After JWT validation:
SecurityContextHolder.getContext().setAuthentication(authentication);
  └─ ThreadLocal storage of Authentication
  └─ Accessible to: Security rules, @PreAuthorize, controllers
  └─ Cleared after request completes

// In controller:
@GetMapping("/api/admin")
public ResponseEntity<?> getAdmin() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    // auth.getName() → "user@example.com"
    // auth.getAuthorities() → [ADMIN, SKILLING_LEAD]
}
```

### **Detail 5: ExpiredJwtException vs MalformedJwtException**

```java
try {
    Jwts.parserBuilder()
        .setSigningKey(key())
        .build()
        .parse(authToken);
} catch (ExpiredJwtException e) {
    // Token signature valid, but exp claim is past current time
    logger.error("JWT token is expired");
} catch (MalformedJwtException e) {
    // Token structure wrong (not 3 parts, invalid base64, etc.)
    logger.error("Invalid JWT token");
}
```

### **Detail 6: OncePerRequestFilter**

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // Extends OncePerRequestFilter, NOT Filter
    
    Why?
      - Filter might run multiple times (e.g., if RequestDispatcher.forward() called)
      - OncePerRequestFilter guarantees exactly 1 execution per request
      - Important for JWT validation (don't validate twice)
}
```

### **Detail 7: Token Storage in localStorage**

```typescript
// All user data stored as JSON string:
localStorage["attendance_user"] = {
    "username": "user@example.com",
    "jwtToken": "eyJhbGc...",
    "roles": ["ADMIN"]
}

// Retrieval:
const user = JSON.parse(localStorage["attendance_user"]);
const token = user.jwtToken;  // Extract for Authorization header

// Vulnerability: XSS attack can steal token
// Mitigation: Use httpOnly cookies instead (not currently used)
```

### **Detail 8: Authorization Header Format**

```
HTTP Request Header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              └────────────────────────────────────────────────┘
                        JWT Token (signed)

"Bearer" prefix is convention (defined in RFC 6750)
Other types: "Basic", "Digest", "AWS4-HMAC-SHA256"

In JwtAuthenticationFilter:
bearerToken.substring(7)  // Remove "Bearer " (7 characters)
```

### **Detail 9: Cost Factor in BCrypt**

```
$2a$10$... = BCrypt hash
        └─ Cost factor = 10
           
Cost factor = 2^10 = 1024 iterations

Why matters:
  10 → ~100ms per hash (good balance)
  12 → ~300ms per hash (slower, more secure)
  15 → ~1 second per hash (very secure, slower login)

Default is 10 (sufficient for 2024)
Can increase as computers get faster
```

### **Detail 10: sessionCreationPolicy.STATELESS**

```java
.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
)

What happens:
  ✅ Spring doesn't create HttpSession
  ✅ No JSESSIONID cookie sent
  ✅ No server-side session storage
  ✅ Stateless authentication via JWT

Traditional approach (SessionCreationPolicy.ALWAYS):
  ❌ Creates HttpSession on login
  ❌ Stores user info in memory/Redis
  ❌ Not horizontally scalable
  ❌ Session fixation vulnerability
```

---

## Security Comparison: Your System vs Alternatives

| Feature | Your System (JWT) | Session-Based | OAuth2 | API Key |
|---------|------------------|---------------|--------|---------|
| **Scalability** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Security** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Complexity** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| **Third Party** | ✅ No | ✅ No | ❌ Yes | ✅ No |
| **Mobile Support** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Summary: Every Component Working Together

```
1. USER LOGS IN
   └─ Enters: user@example.com / password123

2. FRONTEND SENDS REQUEST
   └─ AuthService.login(username, password)
   └─ HTTP POST /auth/login with credentials

3. BACKEND AUTHENTICATES
   └─ LoginController receives request
   └─ AuthenticationManager validates credentials
   └─ CustomUserDetailsService loads from database
   └─ BCryptPasswordEncoder.matches() verifies password

4. JWT CREATED
   └─ JwtTokenProvider.generateToken()
   └─ Algorithm: HMAC-SHA256
   └─ Payload: username + roles + timestamp
   └─ Signed with secret key

5. RESPONSE SENT
   └─ { jwtToken: "eyJhbGc...", roles: ["ADMIN"], ... }

6. FRONTEND STORES TOKEN
   └─ StorageService.saveUser() → localStorage
   └─ User can refresh page, token persists

7. FRONTEND MAKES API REQUEST
   └─ admin.service.ts calls GET /api/admin/associates
   └─ AuthInterceptor intercepts
   └─ Gets token from StorageService.getToken()
   └─ Adds: Authorization: Bearer eyJhbGc...

8. BACKEND VALIDATES TOKEN
   └─ JwtAuthenticationFilter extracts token
   └─ JwtTokenProvider.validateToken() checks:
       ├─ Signature valid? (HMAC-SHA256 verification)
       ├─ Expired? (checks exp claim)
       ├─ Format correct? (3 base64 parts)
   └─ If valid: extract username + roles

9. AUTHORIZATION CHECK
   └─ SecurityConfig checks: User has ADMIN role?
   └─ YES → Endpoint executes
   └─ NO → 403 Forbidden

10. RESPONSE SENT
    └─ Data returned to frontend
    └─ Component updates UI
```

---

**This is your complete authentication architecture!** 🎉

Every request is validated, every password is hashed, every role is checked, and every token is verified. Your system is secure and production-ready.
