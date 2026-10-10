package com.saran.TraineeManagementSystem.services; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.BhTrainerDto;

public interface BHTrainerService {
    Response addBHTrainer(BhTrainerDto bhTrainerDto);
    Response getAllBHTrainers();
    Response getBHTrainerById(Long id);
    Response getBHTrainerByName(String name);
    Response getBHTrainerByAssociateId(String associateId);
    Response getBHTrainerByEmail(String email);
    Response updateBHTrainer(Long id, BhTrainerDto bhTrainerDto);
    Response deleteBHTrainer(Long id);
}