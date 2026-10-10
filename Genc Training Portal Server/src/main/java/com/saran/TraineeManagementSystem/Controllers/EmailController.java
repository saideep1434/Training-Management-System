package com.saran.TraineeManagementSystem.Controllers;

import java.util.Map;
import com.saran.TraineeManagementSystem.Dtos.ResetPasswordRequest;
import com.saran.TraineeManagementSystem.Dtos.Response; // Import the Response DTO
import com.saran.TraineeManagementSystem.services.PasswordService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class EmailController { 
    private final PasswordService passwordService;

    public EmailController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Response> forgotPassword(@RequestBody Map<String, String> request) {
        String Email = request.get("Email");

        if (Email == null || Email.isBlank()) {
            // Return a Response object for bad request
            return ResponseEntity.badRequest().body(Response.builder()
                    .status(400) // HttpStatus.BAD_REQUEST.value()
                    .message("Personal email is required.")
                    .build());
        }

        // Call the service method which now returns a Response object
        Response response = passwordService.initiatePasswordReset(Email);

        // Return ResponseEntity based on the status in the Response object
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    /**
     * Resets the user's password after verifying the OTP.
     * POST /api/auth/reset-password
     * @param request ResetPasswordRequest DTO containing organization email, OTP, and new password.
     * @return ResponseEntity with success message or error.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Response> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        System.out.println(request.getEmail() + " " + request.getToken());

        // Call the service method which now returns a Response object
        Response response = passwordService.resetPassword(request.getEmail(), request.getToken(), request.getNewPassword());

        // Return ResponseEntity based on the status in the Response object
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}