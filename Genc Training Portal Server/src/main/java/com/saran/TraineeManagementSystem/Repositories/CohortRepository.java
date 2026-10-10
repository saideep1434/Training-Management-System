package com.saran.TraineeManagementSystem.Repositories; // Adjust package if different

import com.saran.TraineeManagementSystem.models.BHTrainer;
import com.saran.TraineeManagementSystem.models.Coach;
import com.saran.TraineeManagementSystem.models.Cohort;
import com.saran.TraineeManagementSystem.models.Mentor;
import com.saran.TraineeManagementSystem.models.TechnicalTrainer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List; // If you need to find multiple cohorts by a criteria

@Repository
public interface CohortRepository extends JpaRepository<Cohort, Long> {

    Optional<Cohort> findByCohortCode(String cohortCode);

	List<Cohort> findByTechnicalTrainer(TechnicalTrainer technialTrainer);
	List<Cohort> findByBhTrainer(BHTrainer bhTrainer);
	List<Cohort> findByCoach(Coach coach);
	List<Cohort> findByMentor(Mentor mentor);
    
    

    // You might add more finder methods here as needed, e.g.:
    // List<Cohort> findByDomain_DomainName(String domainName);
    // List<Cohort> findByTechnicalTrainer_TechTrainerName(String trainerName);
}