package com.saran.TraineeManagementSystem.services.serviceImpl;

import com.saran.TraineeManagementSystem.Dtos.Response; // Import the Response DTO
import com.saran.TraineeManagementSystem.models.RegisterAssociate;
import com.saran.TraineeManagementSystem.models.VerificationToken;
import com.saran.TraineeManagementSystem.Repositories.RegisterAssociateRepository;
import com.saran.TraineeManagementSystem.Repositories.VerificationTokenRepository;
import com.saran.TraineeManagementSystem.services.PasswordService; // Ensure this interface exists and has the new methods
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PasswordServiceImpl implements PasswordService {

    private final RegisterAssociateRepository registerAssociateRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository verificationTokenRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String mailUsername;

    public PasswordServiceImpl(RegisterAssociateRepository registerAssociateRepository, PasswordEncoder passwordEncoder,
                               VerificationTokenRepository verificationTokenRepository, JavaMailSender mailSender) {

        this.registerAssociateRepository = registerAssociateRepository;
        this.passwordEncoder = passwordEncoder;
        this.verificationTokenRepository = verificationTokenRepository;
        this.mailSender = mailSender;
    }

    /**
     * Initiates the password reset process by sending an OTP to the user's personal email.
     *
     * @param personalEmail The personal email address of the user for recovery.
     * @return A Response object indicating the success or failure of the operation.
     */
    @Override 
    @Transactional
    public Response initiatePasswordReset(String personalEmail) {
        try {
            RegisterAssociate associate = registerAssociateRepository.findByAssociateEmail(personalEmail)
                    .orElse(null); // Use orElse(null) to handle not found without throwing immediately

            if (associate == null) {
                return Response.builder()
                        .status(HttpStatus.NOT_FOUND.value())
                        .message("User not found with email: " + personalEmail)
                        .build();
            }

            String otp = generateNumericOtp(6);
            LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

            // Delete any existing tokens for this associate to ensure only one active token
            verificationTokenRepository.deleteByAssociate(associate);

            VerificationToken verificationToken = new VerificationToken(otp, associate, expiryDate);
            verificationTokenRepository.save(verificationToken);

            String subject = "GenC Training Management Portal - Password Reset OTP";
            String text = "Your OTP for password reset is: " + otp + "\nThis OTP is valid for 15 minutes.";

            // Use the private sendEmail helper, but wrap its RuntimeException in a Response
            try {
                sendEmail(personalEmail, subject, text);
            } catch (RuntimeException e) {
                // This catch handles the specific RuntimeException from sendEmail
                return Response.builder()
                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .message("Failed to send OTP email: " + e.getMessage())
                        .build();
            }

            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Password reset OTP sent successfully to: " + personalEmail)
                    .build();

        } catch (Exception e) { // Catch any unexpected errors
            System.err.println("An unexpected error occurred during password reset initiation for " + personalEmail + ": " + e.getMessage());
            return Response.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("An unexpected error occurred during password reset initiation. Please try again later.")
                    .build();
        }
    }

    /**
     * Resets the user's password after successful OTP verification.
     *
     * @param Email The user's organization email.
     * @param otp The OTP received by the user.
     * @param newPassword The new password to set.
     * @return A Response object indicating the success or failure of the operation.
     */
    @Override // Mark as @Override if it's part of PasswordService interface
    @Transactional
    public Response resetPassword(String Email, String otp, String newPassword) {
        try {
            RegisterAssociate associate = registerAssociateRepository.findByAssociateEmail(Email)
                    .orElse(null); // Use orElse(null) to handle not found without throwing immediately

            if (associate == null) {
                return Response.builder()
                        .status(HttpStatus.NOT_FOUND.value())
                        .message("User not found with email: " + Email)
                        .build();
            }

            VerificationToken verificationToken = verificationTokenRepository.findByAssociate(associate)
                    .orElse(null); // Use orElse(null)

            if (verificationToken == null) {
                return Response.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message("No active password reset request found for this user. Please initiate reset first.")
                        .build();
            }

            if (!verificationToken.getToken().equals(otp)) {
                return Response.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message("Invalid OTP.")
                        .build();
            }

            if (verificationToken.isExpired()) {
                verificationTokenRepository.delete(verificationToken); // Clean up expired token
                return Response.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message("OTP has expired. Please request a new one.")
                        .build();
            }

            // Encode and set the new password
            associate.setPassword(passwordEncoder.encode(newPassword));
            registerAssociateRepository.save(associate); // Save the updated associate with new password

            // Delete the used verification token
            verificationTokenRepository.delete(verificationToken);

            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Password successfully reset for: " + Email)
                    .build();

        } catch (Exception e) { // Catch any unexpected errors
            System.err.println("An unexpected error occurred during password reset for " + Email + ": " + e.getMessage());
            return Response.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("An unexpected error occurred during password reset. Please try again later.")
                    .build();
        }
    }

    /**
     * Helper method to send an email.
     *
     * @param to The recipient's email address.
     * @param subject The subject of the email.
     * @param text The body text of the email.
     * @throws RuntimeException if email sending fails (this is caught by the public methods).
     */
    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(this.mailUsername);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
            // Re-throw as RuntimeException, which will be caught by the public service methods
            throw new RuntimeException("Failed to send email. Please check server configuration or contact support. Error: " + e.getMessage());
        }
    }

    /**
     * Helper method to generate a numeric OTP of specified length.
     *
     * @param length The desired length of the OTP.
     * @return A randomly generated numeric OTP string.
     */
    private String generateNumericOtp(int length) {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < length; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}