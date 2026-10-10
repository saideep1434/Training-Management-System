package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.Dtos.Response;

public interface PasswordService {
	
	 Response initiatePasswordReset(String personalEmail);
	 Response resetPassword(String email, String otp, String newPassword);
	
}