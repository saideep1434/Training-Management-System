package com.saran.TraineeManagementSystem.config;

import com.saran.TraineeManagementSystem.jwt.JwtAuthenticationFilter;
import com.saran.TraineeManagementSystem.services.CustomUserDetailsService;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager; // Explicitly using InMemoryUserDetailsManager
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables method-level security (e.g., @PreAuthorize)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Constructor injection for JwtAuthenticationFilter
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless REST APIs using tokens
            .cors(withDefaults()) // Enable CORS if your frontend is on a different domain
                       // Configure Exception Handling for REST APIs (return 401/403)
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)) // Send 401 for unauthenticated access
                // .accessDeniedHandler(...) // Optional: Add a custom AccessDeniedHandler for 403 Forbidden errors
            )

            // Configure Session Management to be stateless (crucial for JWT/token-based APIs)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(authorizeRequests ->
            authorizeRequests
                // --- Publicly Accessible Endpoints ---
                // Authentication related endpoints (login, register)
                .requestMatchers("/auth/**").permitAll()
//                .requestMatchers("/forgot-password").permitAll()
//                .requestMatchers("/reset-password").permitAll()

                // Unauthorized page
                .requestMatchers("/unauthorized").permitAll()
                // Swagger UI and OpenAPI documentation
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/v3/api-docs/**").permitAll()
                .requestMatchers("/webjars/**").permitAll() // Often needed for Swagger UI static resources
                .requestMatchers("/swagger-resources/**").permitAll() // Older Swagger paths

                // --- Role-Based Access for API Endpoints (mirroring Angular routes) ---
                
                // GUEST - Read-only access to all GET endpoints (MUST BE FIRST - most permissive)
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/**").hasAnyRole("GUEST", "ADMIN", "SKILLING_LEAD", "ACADEMY_COORDINATOR", "TECHNICAL_TRAINER", "COACH", "BH_TRAINER", "MENTOR", "CR")
                
                // Exception: Allow GUEST to access read-only POST endpoints (semantically GET operations)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/cohorts/role-specific").hasAnyRole("GUEST", "ADMIN", "SKILLING_LEAD", "ACADEMY_COORDINATOR", "TECHNICAL_TRAINER", "COACH", "BH_TRAINER", "MENTOR", "CR")
                
                // Block all other write operations for GUEST
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/**").hasAnyRole("ADMIN", "SKILLING_LEAD", "ACADEMY_COORDINATOR", "TECHNICAL_TRAINER", "COACH", "BH_TRAINER", "MENTOR", "CR")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/**").hasAnyRole("ADMIN", "SKILLING_LEAD", "ACADEMY_COORDINATOR", "TECHNICAL_TRAINER", "COACH", "BH_TRAINER", "MENTOR", "CR")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/**").hasAnyRole("ADMIN", "SKILLING_LEAD", "ACADEMY_COORDINATOR", "TECHNICAL_TRAINER", "COACH", "BH_TRAINER", "MENTOR", "CR")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/**").hasAnyRole("ADMIN", "SKILLING_LEAD", "ACADEMY_COORDINATOR", "TECHNICAL_TRAINER", "COACH", "BH_TRAINER", "MENTOR", "CR")
                
                // ADMIN specific APIs (write operations only - GET already allowed above)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/admin/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/admin/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/admin/**").hasRole("ADMIN")

                // Skilling Lead specific APIs (write operations only - GET already allowed above)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/skilling-lead/**").hasAnyRole("SKILLING_LEAD", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/skilling-lead/**").hasAnyRole("SKILLING_LEAD", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/skilling-lead/**").hasAnyRole("SKILLING_LEAD", "ADMIN")

                // Academic Coordinator specific APIs (write operations only - GET already allowed above)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/academic-coordinator/**").hasAnyRole("ACADEMY_COORDINATOR", "SKILLING_LEAD", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/academic-coordinator/**").hasAnyRole("ACADEMY_COORDINATOR", "SKILLING_LEAD", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/academic-coordinator/**").hasAnyRole("ACADEMY_COORDINATOR", "SKILLING_LEAD", "ADMIN")

                // Technical Trainer specific APIs (write operations only - GET already allowed above)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/tech-trainer/**").hasAnyRole("TECHNICAL_TRAINER", "SKILLING_LEAD", "ADMIN", "ACADEMY_COORDINATOR")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/tech-trainer/**").hasAnyRole("TECHNICAL_TRAINER", "SKILLING_LEAD", "ADMIN", "ACADEMY_COORDINATOR")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/tech-trainer/**").hasAnyRole("TECHNICAL_TRAINER", "SKILLING_LEAD", "ADMIN", "ACADEMY_COORDINATOR")

                // Coach specific APIs (write operations only - GET already allowed above)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/coach/**").hasAnyRole("COACH", "SKILLING_LEAD", "ADMIN","TECHNICAL_TRAINER", "ACADEMY_COORDINATOR")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/coach/**").hasAnyRole("COACH", "SKILLING_LEAD", "ADMIN","TECHNICAL_TRAINER", "ACADEMY_COORDINATOR")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/coach/**").hasAnyRole("COACH", "SKILLING_LEAD", "ADMIN","TECHNICAL_TRAINER", "ACADEMY_COORDINATOR")

                // BH Trainer specific APIs (write operations only - GET already allowed above)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/bh-trainer/**").hasAnyRole("BH_TRAINER", "SKILLING_LEAD", "ADMIN", "ACADEMY_COORDINATOR")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/bh-trainer/**").hasAnyRole("BH_TRAINER", "SKILLING_LEAD", "ADMIN", "ACADEMY_COORDINATOR")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/bh-trainer/**").hasAnyRole("BH_TRAINER", "SKILLING_LEAD", "ADMIN", "ACADEMY_COORDINATOR")

                // Mentor specific APIs (write operations only - GET already allowed above)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/mentor/**").hasAnyRole("MENTOR", "SKILLING_LEAD", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/mentor/**").hasAnyRole("MENTOR", "SKILLING_LEAD", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/mentor/**").hasAnyRole("MENTOR", "SKILLING_LEAD", "ADMIN")

                // CR specific APIs (write operations only - GET already allowed above)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/cr/**").hasAnyRole("CR", "ACADEMY_COORDINATOR", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/cr/**").hasAnyRole("CR", "ACADEMY_COORDINATOR", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/cr/**").hasAnyRole("CR", "ACADEMY_COORDINATOR", "ADMIN")

                // Trainee management for Academic Coordinator/Admin (write operations only - GET already allowed above)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/trainee/**").hasAnyRole("ACADEMY_COORDINATOR", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/trainee/**").hasAnyRole("ACADEMY_COORDINATOR", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/trainee/**").hasAnyRole("ACADEMY_COORDINATOR", "ADMIN")

                // Events API: allow reads to a broader audience including GUEST, restrict writes to specific roles
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/events/**").hasAnyRole("GUEST", "MENTOR", "BH_TRAINER", "ADMIN", "COACH", "TECHNICAL_TRAINER", "ACADEMY_COORDINATOR", "CR")
                // Allow Academic Coordinator to create/update events to achieve feature parity with admin/coach
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/events/**").hasAnyRole("ADMIN", "COACH", "BH_TRAINER", "TECHNICAL_TRAINER", "ACADEMY_COORDINATOR")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/events/**").hasAnyRole("ADMIN", "COACH", "BH_TRAINER", "TECHNICAL_TRAINER", "ACADEMY_COORDINATOR")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/events/**").hasAnyRole("ADMIN", "COACH")

                // Admin-only: Update cohort staff assignments
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/cohorts/*/staff").hasRole("ADMIN")

                // If you have a general dashboard API, you might need to combine roles
                // For example, if /api/dashboard is accessible to multiple roles:
                // .requestMatchers("/api/dashboard/**").hasAnyRole(
                //     "SKILLING_LEAD", "ACADEMY_COORDINATOR", "TECHNICAL_TRAINER",
                //     "COACH", "BH_TRAINER", "MENTOR", "CR", "ADMIN"
                // )

                // --- Catch-all for any other authenticated requests ---
                // Any other request not matched by the above rules will require authentication.
                .anyRequest().authenticated()
        );

        // Add the JWT filter to the Spring Security filter chain
        // It runs before Spring Security's default filters for authentication.
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Defines the in-memory users for authentication.
     * This is your InMemoryUserDetailsManager.
     */
//    @Bean
//    public UserDetailsService userDetailsService() {
//        PasswordEncoder encoder = passwordEncoder();
//
//        // Define your in-memory users with their roles
//        UserDetails user = User.withUsername("user123")
//            .password(encoder.encode("password"))
//            .roles("USER")
//            .build();
//
//        UserDetails admin = User.withUsername("admin123")
//            .password(encoder.encode("adminpass"))
//            .roles("ADMIN") // 'admin' has both ADMIN and USER roles
//            .build();
//
//        UserDetails guest = User.withUsername("guest")
//            .password(encoder.encode("guestpass"))
//            .roles("GUEST")
//            .build();
//        
//        UserDetails academy_coordinator = User.withUsername("academy@gmail.com")
//        		.password(encoder.encode("academy123"))
//        		.roles("ACADEMY")
//        		.build();
//
//        // Return an InMemoryUserDetailsManager with your defined users
//        return new InMemoryUserDetailsManager(user, admin, guest, academy_coordinator);
//    }
    
    @Bean
    public UserDetailsService userDetailsService() {
    	return new CustomUserDetailsService();
    }

    /**
     * 🔓 TEMPORARY: Plain text password encoder (NO HASHING)
     * This allows passwords to be stored and compared as plain text for testing.
     * DO NOT USE IN PRODUCTION - SECURITY RISK!
     * 
     * To restore BCrypt security, change this back to:
     * return new BCryptPasswordEncoder();
     */
    @Bean
    @SuppressWarnings("deprecation")
    public PasswordEncoder passwordEncoder() {
        // Use BCrypt for password hashing. This is required for production.
        return new BCryptPasswordEncoder();
    }

    /**
     * Exposes the AuthenticationManager as a bean.
     * This allows the LoginController to inject and use it for custom authentication.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * On application startup, detect any RegisterAssociate entries that still have
     * plain-text passwords and migrate them to BCrypt-hashed passwords.
     * This uses native SQL to avoid enum conversion issues during migration.
     */
    @Bean
    public CommandLineRunner migratePlainTextPasswords(
            @org.springframework.beans.factory.annotation.Autowired
            javax.sql.DataSource dataSource,
            PasswordEncoder encoder) {
        return args -> {
            System.out.println("[PasswordMigration] Starting password migration check...");
            int migrated = 0;
            int skipped = 0;
            int errors = 0;
            
            try (java.sql.Connection conn = dataSource.getConnection()) {
                // First, fix any records with empty/null roles
                try (java.sql.PreparedStatement fixRoles = conn.prepareStatement(
                    "UPDATE register_associate SET role = 'ADMIN' WHERE role IS NULL OR role = '' OR TRIM(role) = ''")) {
                    int fixed = fixRoles.executeUpdate();
                    if (fixed > 0) {
                        System.out.println("[PasswordMigration] Fixed " + fixed + " records with invalid roles (set to ADMIN)");
                    }
                }
                
                // Now migrate passwords
                try (java.sql.PreparedStatement select = conn.prepareStatement(
                    "SELECT id, associate_email, password FROM register_associate WHERE password IS NOT NULL AND password != ''")) {
                    
                    java.sql.ResultSet rs = select.executeQuery();
                    
                    while (rs.next()) {
                        long id = rs.getLong("id");
                        String email = rs.getString("associate_email");
                        String password = rs.getString("password");
                        
                        try {
                            // Skip already-hashed passwords
                            if (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$")) {
                                System.out.println("[PasswordMigration] Skipping user " + email + " (already BCrypt hashed)");
                                skipped++;
                                continue;
                            }
                            
                            // Migrate plain text password to BCrypt
                            System.out.println("[PasswordMigration] Migrating password for user: " + email);
                            String encoded = encoder.encode(password);
                            
                            try (java.sql.PreparedStatement update = conn.prepareStatement(
                                "UPDATE register_associate SET password = ? WHERE id = ?")) {
                                update.setString(1, encoded);
                                update.setLong(2, id);
                                update.executeUpdate();
                            }
                            
                            migrated++;
                            System.out.println("[PasswordMigration] ✓ Successfully migrated password for: " + email);
                            
                        } catch (Exception userEx) {
                            errors++;
                            System.err.println("[PasswordMigration] ✗ Error migrating password for user " + email + ": " + userEx.getMessage());
                        }
                    }
                }
                
                System.out.println("[PasswordMigration] Migration complete - Migrated: " + migrated + 
                    ", Skipped: " + skipped + ", Errors: " + errors);
                
            } catch (Exception ex) {
                System.err.println("[PasswordMigration] Critical error during migration: " + ex.getMessage());
                ex.printStackTrace();
            }
        };
    }
}