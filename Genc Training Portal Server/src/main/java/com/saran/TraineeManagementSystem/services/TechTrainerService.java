package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.TechnicalTrainerDto;
import com.saran.TraineeManagementSystem.models.TechnicalTrainer;

public interface TechTrainerService {

	Response addTechTrainer(TechnicalTrainerDto technicalTrainerDto);
	Response getAllTechTrainer();
	Response getTechTrainerByName(String name);
	Response getTechTrainerByAssociateId(String associateid);
	Response updateTechTrainer(Long id, TechnicalTrainerDto technicalTrainerDto);
	Response deleteTechTrainer(Long id);
}
