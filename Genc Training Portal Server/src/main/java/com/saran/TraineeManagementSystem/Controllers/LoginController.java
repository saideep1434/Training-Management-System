// src/main/java/com/example/springsecuritydemo/controller/LoginController.java
package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.LoginRequest;
import com.saran.TraineeManagementSystem.Dtos.LoginResponse;
import com.saran.TraineeManagementSystem.Repositories.RegisterAssociateRepository;
import com.saran.TraineeManagementSystem.models.RegisterAssociate;
import com.saran.TraineeManagementSystem.jwt.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

//code for login controller
@RestController
@RequestMapping("/auth")
public class LoginController {

    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RegisterAssociateRepository registerAssociateRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
                           RegisterAssociateRepository registerAssociateRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.registerAssociateRepository = registerAssociateRepository;
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("╔════════════════════════════════════════════════════════════════╗");
            logger.info("║           LOGIN REQUEST RECEIVED                               ║");
            logger.info("║           🔓 PLAIN TEXT MODE (TEMPORARY)                       ║");
            logger.info("╚════════════════════════════════════════════════════════════════╝");
            logger.info("Username (Email): {}", loginRequest.getUsername());
            logger.info("Password: {}", loginRequest.getPassword());
            logger.info("────────────────────────────────────────────────────────────────");
            
            logger.info("🔐 Calling AuthenticationManager.authenticate()...");
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            
            logger.info("✓ Authentication successful!");
            logger.info("  - Principal: {}", authentication.getPrincipal());
            logger.info("  - Authenticated: {}", authentication.isAuthenticated());
            
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String username = authentication.getName();
            List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

            logger.info("✓ Generating JWT token...");
            String jwt = jwtTokenProvider.generateToken(authentication);
            logger.info("✓ JWT token generated: {}...", jwt.substring(0, Math.min(20, jwt.length())));
            
            // Look up associateId using the authenticated username (email)
            String associateId = registerAssociateRepository
                    .findByAssociateEmail(username)
                    .map(RegisterAssociate::getAssociateId)
                    .orElse(null);

            logger.info("╔════════════════════════════════════════════════════════════════╗");
            logger.info("║           LOGIN SUCCESS ✓                                      ║");
            logger.info("╚════════════════════════════════════════════════════════════════╝");
            logger.info("Username: {}", username);
            logger.info("Associate ID: {}", associateId);
            logger.info("Roles: {}", roles);
            logger.info("════════════════════════════════════════════════════════════════");
            
            return ResponseEntity.ok(
                new LoginResponse(true, "Login successful!", username, roles, jwt, associateId)
            );

        } catch (AuthenticationException e) {
            logger.error("╔════════════════════════════════════════════════════════════════╗");
            logger.error("║           LOGIN FAILED ✗                                       ║");
            logger.error("╚════════════════════════════════════════════════════════════════╝");
            logger.error("Username attempted: {}", loginRequest.getUsername());
            logger.error("Exception Type: {}", e.getClass().getSimpleName());
            logger.error("Exception Message: {}", e.getMessage());
            logger.error("Stack Trace:", e);
            logger.error("════════════════════════════════════════════════════════════════");
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new LoginResponse(false, "Invalid username or password.", null, null, null, null)
            );
        } catch (Exception e) {
            logger.error("╔════════════════════════════════════════════════════════════════╗");
            logger.error("║           UNEXPECTED ERROR                                     ║");
            logger.error("╚════════════════════════════════════════════════════════════════╝");
            logger.error("Exception: ", e);
            logger.error("════════════════════════════════════════════════════════════════");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new LoginResponse(false, "An error occurred during login: " + e.getMessage(), null, null, null)
            );
        }
    }
    
    @PostMapping("/guest-login")
    public ResponseEntity<LoginResponse> guestLogin() {
        try {
            logger.info("╔════════════════════════════════════════════════════════════════╗");
            logger.info("║           GUEST LOGIN REQUEST                                  ║");
            logger.info("╚════════════════════════════════════════════════════════════════╝");
            
            // Create a guest authentication with ROLE_GUEST
            List<String> guestRoles = List.of("ROLE_GUEST");
            String guestUsername = "guest@trainingms.com";
            
            // Generate JWT token for guest user
            String jwt = jwtTokenProvider.generateTokenForGuest(guestUsername, guestRoles);
            
            logger.info("✓ Guest JWT token generated");
            logger.info("Username: {}", guestUsername);
            logger.info("Roles: {}", guestRoles);
            logger.info("════════════════════════════════════════════════════════════════");
            
            return ResponseEntity.ok(
                new LoginResponse(true, "Guest login successful!", guestUsername, guestRoles, jwt, "GUEST")
            );
            
        } catch (Exception e) {
            logger.error("╔════════════════════════════════════════════════════════════════╗");
            logger.error("║           GUEST LOGIN ERROR                                    ║");
            logger.error("╚════════════════════════════════════════════════════════════════╝");
            logger.error("Exception: ", e);
            logger.error("════════════════════════════════════════════════════════════════");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new LoginResponse(false, "Guest login failed: " + e.getMessage(), null, null, null, null)
            );
        }
    }
}