package com.saran.TraineeManagementSystem.services;

import java.util.Collections;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.saran.TraineeManagementSystem.models.RegisterAssociate;
import com.saran.TraineeManagementSystem.models.User;
import com.saran.TraineeManagementSystem.Dtos.RegisterAssociateDto;
import com.saran.TraineeManagementSystem.Repositories.RegisterAssociateRepository;
import com.saran.TraineeManagementSystem.Repositories.UserRepository;

public class CustomUserDetailsService implements UserDetailsService{
	
	private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);
	
//	@Autowired
//	private UserRepository userRepository;
	
	@Autowired
	private RegisterAssociateRepository registerAssociateRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		logger.info("============================================");
		logger.info("LOGIN ATTEMPT - Starting authentication for: {}", username);
		logger.info("Using configured PasswordEncoder for authentication");
		logger.info("============================================");
		
		Optional<RegisterAssociate> userOptional = registerAssociateRepository.findByAssociateEmail(username);
		
		if (userOptional.isEmpty()) {
			logger.error("❌ LOGIN FAILED - User not found with email: {}", username);
			throw new UsernameNotFoundException("User not found with email: " + username);
		}
		
		RegisterAssociate user = userOptional.get();
		
		logger.info("✓ User found in database:");
		logger.info("  - Name: {}", user.getAssociateName());
		logger.info("  - Email: {}", user.getAssociateEmail());
		logger.info("  - Associate ID: {}", user.getAssociateId());
		logger.info("  - Role: {}", user.getRole());
		logger.info("  - Password: [REDACTED]");
		
		String roleName = String.valueOf(user.getRole());
		String prefixedRoleName = "ROLE_" + roleName;
		logger.info("  - Authority: {}", prefixedRoleName);

		// TEMPORARY WORKAROUND: Using NoOpPasswordEncoder globally
		// Password will be compared as plain text directly
		String passwordForAuth = user.getPassword();  // Stored password (expected to be encoded)
		logger.info("Stored password (hidden) present for user - using configured encoder during authentication");
		
		UserDetails userDetails = new org.springframework.security.core.userdetails.User(
			user.getAssociateEmail(), 
			passwordForAuth,  // Plain text password (no prefix needed)
			Collections.singletonList(new SimpleGrantedAuthority(prefixedRoleName))
		);
		
		logger.info("✓ UserDetails object created (PLAIN TEXT MODE)");
		logger.info("============================================");
		
		return userDetails;
	}

}
