package com.saran.TraineeManagementSystem.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saran.TraineeManagementSystem.models.Trainee;

import java.util.List;
import java.util.Optional; // Import for Optional


public interface TraineeRepository extends JpaRepository<Trainee, Long> {
    Optional<List<Trainee>> findByTraineeName(String traineeName); // Returns Optional<List>
    Optional<Trainee> findByTraineeAssociateId(String traineeAssociateId); // Returns Optional<Trainee>
	Optional<Trainee> findByTraineeEmail(String traineeEmail);
}