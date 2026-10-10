package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.Dtos.RegisterAssociateDto;
import com.saran.TraineeManagementSystem.Dtos.Response;

public interface AdminService {

	
	Response sendMail(RegisterAssociateDto registerAssociateDto, String actionType, String specificDetails);
	Response addAssociate(RegisterAssociateDto associateDto);
	Response getAssociateById(Long id);
	Response getAllAssociates();
	Response updateAssociate(Long id, RegisterAssociateDto updatedAssociateDto);
	Response deleteAssociate(Long id);
}
