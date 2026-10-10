package com.saran.TraineeManagementSystem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.saran.TraineeManagementSystem.Dtos.RegisterRequest;
import com.saran.TraineeManagementSystem.models.User;
import com.saran.TraineeManagementSystem.Repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // REMOVED: @Autowired private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerNewUser(RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        User newUser = new User();
        newUser.setUsername(registerRequest.getUsername());
        // Use the already encoded password from RegisterRequest (encoded by controller)
        newUser.setPassword(registerRequest.getPassword());
        newUser.setEnabled(true); // Ensure new users are enabled

        // REMOVED: Role assignment logic

        return userRepository.save(newUser);
    }
}