package com.saran.TraineeManagementSystem.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saran.TraineeManagementSystem.models.TechnicalTrainer;

public interface TechTrainerRepository extends JpaRepository<TechnicalTrainer, Long> {

	Optional<TechnicalTrainer> findByTechTrainerName(String name);

	Optional<TechnicalTrainer> findByTechTrainerAssociateId(String associateId);
	
	Optional<TechnicalTrainer> findByTechTrainerEmail(String techTrainerEmail);
	
	void deleteByTechTrainerAssociateId(String associateId);
	
	
	

}
