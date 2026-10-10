package com.saran.TraineeManagementSystem.services;
 
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.LearningPathBatchRequestDto;
import com.saran.TraineeManagementSystem.Dtos.LearningPathDto;
import com.saran.TraineeManagementSystem.Dtos.LearningPathDayDetailDto; // For specific day updates
 
public interface LearningPathService {
    Response createOrUpdateLearningPath(LearningPathBatchRequestDto requestDto);
    Response getLearningPathByServiceLineName(String serviceLineName);
    Response updateLearningPathDay(Long dayEntryId, LearningPathDayDetailDto dayDetailDto); // Update a single day entry
    Response deleteLearningPathByServiceLine(String serviceLineName);
    Response getAllLearningPathsBasicInfo();
    Response getLearningPathByLearningPathId(Long id);
    Response updateLearningPathById(Long learningPathId,LearningPathBatchRequestDto requestDto);
}