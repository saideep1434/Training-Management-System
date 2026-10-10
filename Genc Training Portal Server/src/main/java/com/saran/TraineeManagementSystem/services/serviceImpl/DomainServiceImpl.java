package com.saran.TraineeManagementSystem.services.serviceImpl;

import com.saran.TraineeManagementSystem.Dtos.DomainDto;
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.ServiceLineDto;
import com.saran.TraineeManagementSystem.models.Domain;
import com.saran.TraineeManagementSystem.Repositories.DomainRepository;
import com.saran.TraineeManagementSystem.services.DomainService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public  class DomainServiceImpl implements DomainService {

    private final DomainRepository domainRepository;
    private final ModelMapper modelMapper;
	private String existingDomainName;
    
    public DomainServiceImpl(DomainRepository domainRepository, ModelMapper modelMapper) {
        this.domainRepository = domainRepository;
        this.modelMapper = modelMapper;
    }
    
    @Override
    public Response addDomain(DomainDto domainDto) {
        Optional<Domain> existingDomain = domainRepository.findByDomainName(domainDto.getDomainName());
        if (existingDomain.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value())
                    .message("Domain with name " + domainDto.getDomainName() + " is already present")
                    .build();
        }
        Domain domain = modelMapper.map(domainDto, Domain.class);
        domainRepository.save(domain);
        return Response.builder()
                    .status(HttpStatus.CREATED.value())
                    .message("Domain added successfully")
                    .build();
    }

    @Override
    public Response getAllDomain() {
        List<DomainDto> domains = domainRepository.findAll().stream()
        		.map(domain -> modelMapper.map(domain,DomainDto.class))
        		.toList();
        
         if(domains.isEmpty()){
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No domains found.")
                    .build();
        }
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("All domains retrieved successfully")
                .domainNameList(domains)
                .build();
    }

    @Override
    public Response getDomainByName(String domainName) {
        Optional<Domain> OptionalDomain = domainRepository.findByDomainName(domainName);
        
        if (OptionalDomain.isPresent()) {
        	Domain domain = OptionalDomain.get();
        	DomainDto domainDto = modelMapper.map(domain,DomainDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Domain retrieved successfully")
                    .domainName(domainDto)
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Domain with name " + domainName + " not found")
                    .build();
        }
    }
    
    
 // Inside DomainServiceImpl
    @Override
    @Transactional
    public Response updateDomain(Long domainId, DomainDto domainDto) {
        Optional<Domain> existingDomainOptional = domainRepository.findById(domainId);
        if (existingDomainOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Domain with ID " + domainId + " not found.")
                    .build();
        }
        Domain existingDomain = existingDomainOptional.get();
        // Map the DTO to the existing entity. This updates domainName, serviceLines, etc.
        modelMapper.map(domainDto, existingDomain);
        // Ensure ID from path variable is preserved as the target entity's ID
        existingDomain.setDomainId(domainId); // Important: ModelMapper might not set ID if DTO doesn't have it explicitly
        domainRepository.save(existingDomain);
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Domain with ID " + domainId + " updated successfully.")
                .build();
    }
    
    @Override
    @Transactional
    public Response updateDomainByName(String existingDomainName, DomainDto updatedDomainDto) {
        Optional<Domain> existingDomainOptional = domainRepository.findByDomainName(existingDomainName);

        if (existingDomainOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No domain found with name: '" + existingDomainName + "'.")
                    .build();
        }

        Domain existingDomain = existingDomainOptional.get();

        // Map properties from DTO to existing entity.
        // This will update the domainName of existingDomain to updatedDomainDto.getDomainName()
        modelMapper.map(updatedDomainDto, existingDomain);

        // Explicitly set the domain name from the DTO just to be certain,
        // especially if the DTO's name is meant to be the new name.
        existingDomain.setDomainName(updatedDomainDto.getDomainName());

        domainRepository.save(existingDomain);

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Domain '" + existingDomainName + "' updated successfully to '" + updatedDomainDto.getDomainName() + "'.")
                .build();
    }

    @Override
    public Response deleteDomain(Long domainId) {
        Optional<Domain> existingDomain = domainRepository.findById(domainId);
        if (existingDomain.isPresent()) {
            domainRepository.deleteById(domainId);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Domain deleted successfully")
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Domain with ID " + domainId + " not found")
                    .build();
        }
    }
        
        
        @Override
        @Transactional
        public Response deleteDomainByName(String domainName) {
            
            Optional<Domain> existingDomainOptional = domainRepository.findByDomainName(domainName);
            if (existingDomainOptional.isPresent()) {
                domainRepository.deleteByDomainName(domainName);
                return Response.builder()
                        .status(HttpStatus.OK.value())
                        .message("Domain deleted successfully")
                        .build();
            } else {
                return Response.builder()
                        .status(HttpStatus.NOT_FOUND.value())
                        .message("Domain with Name " + domainName + " not found")
                        .build();
            }
    }
}
