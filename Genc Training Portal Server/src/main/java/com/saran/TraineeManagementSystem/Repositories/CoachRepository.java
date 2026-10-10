package com.saran.TraineeManagementSystem.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saran.TraineeManagementSystem.models.Coach;

public interface CoachRepository  extends JpaRepository<Coach, Long> {

	Optional<Coach> findByCoachName(String name);

	Optional<Coach> findByCoachAssociateId(String associateId);
	
	Optional<Coach> findByCoachEmail(String coachEmail);
	
	void deleteByCoachAssociateId(String associateId);


}
