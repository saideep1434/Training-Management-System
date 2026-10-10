package com.saran.TraineeManagementSystem.Repositories;


import org.springframework.data.jpa.repository.JpaRepository;

import com.saran.TraineeManagementSystem.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
 Optional<com.saran.TraineeManagementSystem.models.User> findByUsername(String username);
 
}
