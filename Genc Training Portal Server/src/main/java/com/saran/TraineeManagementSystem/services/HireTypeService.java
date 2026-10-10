package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.HireTypeDto;

public interface HireTypeService {
    Response addHireType(HireTypeDto hireTypeDto);
    Response getAllHireTypes();
    Response getHireTypeById(Long id);
    Response getHireTypeByType(String type); // Assuming 'type' maps to 'hireType' in DTO
    Response updateHireType(Long id, HireTypeDto hireTypeDto);
    Response deleteHireType(Long id);
}