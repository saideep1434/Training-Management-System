package com.saran.TraineeManagementSystem.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saran.TraineeManagementSystem.models.Domain;
import com.saran.TraineeManagementSystem.models.ServiceLine;

public interface ServiceLineRepository extends JpaRepository<ServiceLine, Long> {

	Optional<ServiceLine> findByTrackName(String trackName);

	

}
