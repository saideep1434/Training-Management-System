
package com.saran.TraineeManagementSystem.Dtos;
 
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Objects;
 
/**
 * DTO for the password reset request, used to verify OTP and set new password.
 */
public class ResetPasswordRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    private String email;
 
    @NotBlank(message = "OTP is required")
    @Size(min = 6, max = 6, message = "OTP must be 6 digits")
    private String token; // This field holds the OTP
 
    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 255, message = "New password must be between 6 and 255 characters")
    private String newPassword;
 
    // No-argument constructor
    public ResetPasswordRequest() {
    }
 
    // All-argument constructor
    public ResetPasswordRequest(String Email, String token, String newPassword) {
        this.email = Email;
        this.token = token;
        this.newPassword = newPassword;
    }
 
    // --- Getters ---
    public String getEmail() {
        return email;
    }
 
    public String getToken() {
        return token;
    }
 
    public String getNewPassword() {
        return newPassword;
    }
 
    // --- Setters ---
    public void setEmail(String Email) {
        this.email = Email;
    }
 
    public void setToken(String token) {
        this.token = token;
    }
 
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
 
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ResetPasswordRequest that = (ResetPasswordRequest) o;
        return Objects.equals(email, that.email) &&
               Objects.equals(token, that.token) &&
               Objects.equals(newPassword, that.newPassword);
    }
 
    @Override
    public int hashCode() {
        return Objects.hash(email, token, newPassword);
    }
 
    @Override
    public String toString() {
        return "ResetPasswordRequest{" +
               "Email='" + email + '\'' +
               ", token='" + token + '\'' +
               ", newPassword='" + newPassword + '\'' +
               '}';
    }
}
 
 