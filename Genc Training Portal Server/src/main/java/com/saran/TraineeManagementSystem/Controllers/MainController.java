// src/main/java/com/example/springsecuritydemo/controller/MyController.java
package com.saran.TraineeManagementSystem.Controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // For accessing auth object in method
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal; // For accessing principal in method

@RestController
public class MainController {

    @GetMapping("/public/hello")
    public String publicHello() {
        return "Hello from the public endpoint!";
    }

    @GetMapping("/private/hello")
    public String privateHello() {
        return "Hello from the private endpoint! (Requires authentication)";
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "Welcome to the Admin Dashboard! (ADMIN access via URL)";
    }

    @GetMapping("/user/profile")
    public String userProfile() {
        return "Welcome to your User Profile! (USER or ADMIN access via URL)";
    }

    @GetMapping("/secured/admin-only")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminOnlyMethod() {
        return "This content is for ADMINs only! (Method-level security)";
    }

    @GetMapping("/secured/user-or-admin")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public String userOrAdminMethod() {
        return "This content is for USERs or ADMINs! (Method-level security)";
    }

    @GetMapping("/secured/authenticated-only")
    @PreAuthorize("isAuthenticated()")
    public String authenticatedOnlyMethod(Authentication authentication) {
        return "This content is for any authenticated user, " + authentication.getName() + "! (Method-level security)";
    }

    @GetMapping("/secured/my-username")
    @PreAuthorize("isAuthenticated()")
    public String getMyUsername(Principal principal) {
        return "Your username is: " + principal.getName();
    }
}