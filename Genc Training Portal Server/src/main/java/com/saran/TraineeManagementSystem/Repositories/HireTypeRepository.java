package com.saran.TraineeManagementSystem.Repositories;

import com.saran.TraineeManagementSystem.models.HireType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface HireTypeRepository extends JpaRepository<HireType, Long> {

    // Find a HireType by its type string (e.g., "Full-Time")
    Optional<HireType> findByHireType(String hireType);
}