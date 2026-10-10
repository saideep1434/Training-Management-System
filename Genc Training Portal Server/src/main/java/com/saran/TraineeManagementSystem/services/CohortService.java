package com.saran.TraineeManagementSystem.services; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.CohortDto;
import com.saran.TraineeManagementSystem.Dtos.RegisterAssociateDto;
import com.saran.TraineeManagementSystem.Dtos.CohortStaffUpdateDto;
import com.saran.TraineeManagementSystem.models.Cohort;

public interface CohortService {
    Response addCohort(CohortDto cohortDto);
    Response getAllCohorts();
    Response getCohortById(Long id);
    Response getCohortByCode(String code); // Changed from 'name' to 'code' as you have cohortCode
    Response updateCohort(Long id, CohortDto cohortDto);
    Response deleteCohort(Long id);
    Response getCohortsByTechnicalTrainerAssociateId(String trainerAssociateId);
    Response getCohortsByRole(RegisterAssociateDto associate);
    Response updateCohortStaff(Long cohortId, CohortStaffUpdateDto staffDto);

    Cohort getCohortByIdTesting(Long id);
}