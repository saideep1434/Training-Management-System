package com.saran.TraineeManagementSystem.services.serviceImpl;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.ServiceLineDto;
import com.saran.TraineeManagementSystem.models.Domain;
import com.saran.TraineeManagementSystem.models.ServiceLine;
import com.saran.TraineeManagementSystem.Repositories.DomainRepository;
import com.saran.TraineeManagementSystem.Repositories.ServiceLineRepository; // Corrected import
import com.saran.TraineeManagementSystem.services.ServiceLineService;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceLineServiceImpl implements ServiceLineService {

    private final ServiceLineRepository serviceLineRepository;
    private final DomainRepository domainRepository;
    private final ModelMapper modelMapper;
    
    public ServiceLineServiceImpl(ServiceLineRepository serviceLineRepository, DomainRepository domainRepository, ModelMapper modelMapper) {
        this.serviceLineRepository = serviceLineRepository;
        this.domainRepository = domainRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Response addServiceLine(ServiceLineDto serviceLineDto) {
        // Check if the service line is already present
        Optional<ServiceLine> existingServiceLine = serviceLineRepository.findByTrackName(serviceLineDto.getTrackName());
        if (existingServiceLine.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value())
                    .message("Service Line with Track Name: " + serviceLineDto.getTrackName() + " already exists")
                    .build();
        }

        // 1. Fetch the Domain from the database using the domainName from the DTO
        Optional<Domain> domainOptional = domainRepository.findByDomainName(serviceLineDto.getDomainName());
        if (!domainOptional.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Domain with name: " + serviceLineDto.getDomainName() + " not found")
                    .build();
        }
        Domain domain = domainOptional.get();

        // 2. Map the DTO to a ServiceLine entity
        ServiceLine serviceLine = modelMapper.map(serviceLineDto, ServiceLine.class);
        serviceLine.setDomain(domain); // Set the Domain


        serviceLineRepository.save(serviceLine); // Capture the saved ServiceLine

        return Response.builder()
                .status(HttpStatus.CREATED.value())
                .message("Service Line added successfully")
                
                .build();
    }


    @Override
    public Response getAllServiceLine() {
        List<ServiceLine> serviceLines = serviceLineRepository.findAll();
        if(serviceLines.isEmpty()){
             return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No Service Lines found.")
                    .build();
        }
        List<ServiceLineDto> serviceLineDtos = serviceLines.stream()
        										.map(serviceLine -> modelMapper.map(serviceLine, ServiceLineDto.class))
        										.toList();
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("All Service Lines retrieved successfully")
                .serviceLines(serviceLineDtos)
                .build();
    }

    @Override
    public Response updateServiceLine(Long serviceLineId, ServiceLineDto serviceLineDto) {
        Optional<ServiceLine> existingServiceLineOptional = serviceLineRepository.findById(serviceLineId);

        if(existingServiceLineOptional.isEmpty()) {
        	return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Service Line with ID " + serviceLineId + " not found")
                    .build();
        }
        
        ServiceLine serviceLine = existingServiceLineOptional.get();
        
        serviceLine.setTrackName(serviceLineDto.getTrackName());
        
        Optional<Domain> domain = domainRepository.findByDomainName(serviceLineDto.getDomainName());
        if (!domain.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Domain with name: " + serviceLineDto.getDomainName() + " not found")
                    .build();
        }
        serviceLine.setDomain(domain.get());
        
        serviceLineRepository.save(serviceLine);
        
        return Response.builder()
        		.status(HttpStatus.OK.value())
        		.message("Service Line Updated Successfully")
        		.build();    }
    
    
    @Override
    public Response updateServiceLine(String trackName, ServiceLineDto serviceLineDto) {
        // Find the existing service line by its CURRENT trackName
        Optional<ServiceLine> existingServiceLineOptional = serviceLineRepository.findByTrackName(trackName);

        if (existingServiceLineOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Service Line with Track Name '" + trackName + "' not found for update.")
                    .build();
        }

        ServiceLine serviceLine = existingServiceLineOptional.get();

        // Find the new Domain by its name (if domain association is changing)
        Optional<Domain> domainOptional = domainRepository.findByDomainName(serviceLineDto.getDomainName());
        if (domainOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Domain with name: " + serviceLineDto.getDomainName() + " not found for update. Please ensure the domain exists.")
                    .build();
        }
        Domain newDomain = domainOptional.get();

        // Check for duplicate trackName if the trackName itself is changing
        // and the new trackName already exists for a different service line.
        if (!serviceLine.getTrackName().equals(serviceLineDto.getTrackName())) {
            Optional<ServiceLine> serviceLineWithNewTrackName = serviceLineRepository.findByTrackName(serviceLineDto.getTrackName());
            if (serviceLineWithNewTrackName.isPresent() && !serviceLineWithNewTrackName.get().getServiceLineId().equals(serviceLine.getServiceLineId())) {
                return Response.builder()
                        .status(HttpStatus.CONFLICT.value())
                        .message("Service Line with new Track Name '" + serviceLineDto.getTrackName() + "' already exists.")
                        .build();
            }
        }

        // Update properties
        serviceLine.setTrackName(serviceLineDto.getTrackName()); // Update to the new track name from DTO
        serviceLine.setDomain(newDomain); // Update the associated Domain

        serviceLineRepository.save(serviceLine);

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Service Line '" + trackName + "' updated successfully to '" + serviceLineDto.getTrackName() + "'.")
                .build();
    }
     
    
    @Override
    public Response deleteServiceLine(String trackName) {
        Optional<ServiceLine> existingServiceLine = serviceLineRepository.findByTrackName(trackName);
        if (existingServiceLine.isPresent()) {
            serviceLineRepository.delete(existingServiceLine.get()); // Delete by entity
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Service Line '" + trackName + "' deleted successfully.")
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Service Line with Track Name '" + trackName + "' not found for deletion.")
                    .build();
        }
    }


    @Override
    public Response deleteServiceLine(Long serviceLineId) {
        Optional<ServiceLine> existingServiceLine = serviceLineRepository.findById(serviceLineId);
        if (existingServiceLine.isPresent()) {
            serviceLineRepository.deleteById(serviceLineId);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Service Line deleted successfully")
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Service Line with ID " + serviceLineId + " not found")
                    .build();
        }
    }
}

