package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.TraineeDto;
import java.util.List;

public interface TraineeService {
    Response addTrainee(TraineeDto traineeDto);
    Response getAllTrainees();
    Response getTraineeById(Long id);
    Response getTraineeByName(String name);
    Response getTraineeByAssociateId(String associateId);
    Response updateTrainee(Long id, TraineeDto traineeDto);
    Response deleteTrainee(Long id);
    Response listFiltered(String domainName, String skillsLike, Boolean unassignedOnly);
    Response assignToCohort(List<Long> traineeIds, Long cohortId);
    /**
     * Bulk upsert trainees by associateId/email. When updateExisting is true, existing
     * records will be updated, otherwise existing records are skipped.
     */
    Response bulkUpsert(java.util.List<TraineeDto> trainees, Boolean updateExisting);
}