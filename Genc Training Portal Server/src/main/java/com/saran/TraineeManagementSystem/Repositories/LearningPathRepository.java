package com.saran.TraineeManagementSystem.Repositories;
 
import com.saran.TraineeManagementSystem.models.LearningPath;
import com.saran.TraineeManagementSystem.models.ServiceLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import java.util.Optional;
 
@Repository
public interface LearningPathRepository extends JpaRepository<LearningPath, Long> {
    Optional<LearningPath> findByServiceLine_ServiceLineId(Long serviceLineId);
    Optional<LearningPath> findByServiceLine(ServiceLine serviceLine); // Useful for finding by object
}