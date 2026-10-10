package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.Dtos.CoachDto;
import com.saran.TraineeManagementSystem.Dtos.Response;

import com.saran.TraineeManagementSystem.models.Coach;

public interface CoachService {
	
	Response getAllCoaches();
	Response getCoachByName(String name);
	Response getCoachByAssociateId(String associateId);
	Response addCoach(CoachDto coachDto);
	Response updateCoach(Long id,CoachDto coachDto) ;
	Response deleteCoach(Long id);
	
}
