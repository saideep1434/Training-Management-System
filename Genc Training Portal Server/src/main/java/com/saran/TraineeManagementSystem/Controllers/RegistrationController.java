package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.RegisterRequest;
import com.saran.TraineeManagementSystem.Dtos.RegisterResponse;
import com.saran.TraineeManagementSystem.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Ensure this is autowired, not newed up
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class RegistrationController {

    // Removed in-memory maps as they are not used with UserService
    // private final Map<String, String> inMemoryRegisteredUsers = new ConcurrentHashMap<>();
    // private final Map<String, String> inMemoryRegisteredUserRoles = new ConcurrentHashMap<>();

    @Autowired // Use @Autowired for PasswordEncoder as a bean
    private PasswordEncoder passwordEncoder;

    // Removed constructor that instantiates BCryptPasswordEncoder directly
    // public RegistrationController(PasswordEncoder passwordEncoder) {
    //     this.passwordEncoder = new BCryptPasswordEncoder();
    // }

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@RequestBody RegisterRequest registrationRequest) {
        String username = registrationRequest.getUsername();
        String password = registrationRequest.getPassword();

        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(new RegisterResponse(false, "Username and password cannot be empty.", null, null));
        }

        try {
            // Encode password before setting it in the request and passing to service
            String encodedPassword = passwordEncoder.encode(password);
            registrationRequest.setPassword(encodedPassword);

            // Now, call the UserService to save the user to the database
            userService.registerNewUser(registrationRequest);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                new RegisterResponse(true, "User '" + username + "' registered successfully!", username, null)
            );
        } catch (IllegalArgumentException e) {
            // Catch specific exceptions from UserService, like username already exists
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new RegisterResponse(false, e.getMessage(), username, null));
        } catch (Exception e) {
            // Catch any other unexpected errors during registration
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new RegisterResponse(false, "An error occurred during registration: " + e.getMessage(), null, null)
            );
        }
    }
}