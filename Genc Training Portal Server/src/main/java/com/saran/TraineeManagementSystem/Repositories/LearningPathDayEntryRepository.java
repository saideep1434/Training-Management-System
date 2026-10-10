package com.saran.TraineeManagementSystem.Repositories;

import com.saran.TraineeManagementSystem.models.LearningPath;
import com.saran.TraineeManagementSystem.models.LearningPathDayEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPathDayEntryRepository extends JpaRepository<LearningPathDayEntry, Long> {
    List<LearningPathDayEntry> findByLearningPath_LearningPathId(Long learningPathId);
}