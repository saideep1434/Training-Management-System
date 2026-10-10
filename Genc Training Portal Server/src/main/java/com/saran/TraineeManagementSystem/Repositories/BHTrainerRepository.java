package com.saran.TraineeManagementSystem.Repositories; // Adjust package if different

import com.saran.TraineeManagementSystem.models.BHTrainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BHTrainerRepository extends JpaRepository<BHTrainer, Long> {

    // Find a BH Trainer by name (can return multiple if names are not unique, but often they are not strictly unique like IDs)
    // For now, let's assume it returns Optional<BHTrainer> to match common lookup patterns
    Optional<BHTrainer> findByBhTrainerName(String bhTrainerName);

    // Find a BH Trainer by associate ID (should be unique)
    Optional<BHTrainer> findByBhTrainerAssociateId(String bhTrainerAssociateId);

    // Find a BH Trainer by email (should be unique)
    Optional<BHTrainer> findByBhTrainerEmail(String bhTrainerEmail);
    
    void deleteByBhTrainerAssociateId(String associateId);
}