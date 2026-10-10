package com.saran.TraineeManagementSystem.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saran.TraineeManagementSystem.models.RegisterAssociate;
import com.saran.TraineeManagementSystem.models.UserRoles;


public interface RegisterAssociateRepository extends JpaRepository<RegisterAssociate, Long> {
	
	
     Optional<RegisterAssociate> findByAssociateEmail(String associateEmail);
     List<RegisterAssociate> findByRole(UserRoles role);
     Optional<RegisterAssociate> findByAssociateId(String associateId);
}
