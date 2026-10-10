package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.ServiceLineDto;
import com.saran.TraineeManagementSystem.models.ServiceLine;

public interface ServiceLineService {

	Response addServiceLine(ServiceLineDto serviceLineDto);
	Response getAllServiceLine();
	Response updateServiceLine(Long serviceLineId,ServiceLineDto serviceLineDto);
	Response deleteServiceLine(Long serviceLineId);
    Response updateServiceLine(String trackName, ServiceLineDto serviceLineDto);
    Response deleteServiceLine(String trackName);

}
