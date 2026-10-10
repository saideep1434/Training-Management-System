package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.Dtos.DomainDto;
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.models.Domain;

public interface DomainService {

	Response addDomain(DomainDto domainDto );
	Response getAllDomain();
	Response getDomainByName(String domainName);
	Response updateDomain(Long domainId,DomainDto domainDto);
	Response deleteDomain(Long domainId);
	//Response updateDomainwithName(String domainName, DomainDto domain);
	
    Response updateDomainByName(String existingDomainName, DomainDto updatedDomainDto);
    Response deleteDomainByName(String existingDomainName);
}
