package com.saran.TraineeManagementSystem.services.serviceImpl;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.VerticalDto;
import com.saran.TraineeManagementSystem.models.Domain;
import com.saran.TraineeManagementSystem.models.Vertical;
import com.saran.TraineeManagementSystem.Repositories.*;
import com.saran.TraineeManagementSystem.services.VerticalService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VerticalServiceImpl implements VerticalService {

    private final VerticalRepository verticalRepository;
    private final DomainRepository domainRepository; // Inject DomainRepository
    private final ModelMapper modelMapper;
    
    public VerticalServiceImpl(VerticalRepository verticalRepository, DomainRepository domainRepository, ModelMapper modelMapper) {
        this.verticalRepository = verticalRepository;
        this.domainRepository = domainRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Response addVertical(VerticalDto verticalDto) {
        // First, find the Domain by its name
        Optional<Domain> domainOptional = domainRepository.findByDomainName(verticalDto.getDomainName());
        if (domainOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Domain with name '" + verticalDto.getDomainName() + "' not found. Please create the domain first.")
                    .build();
        }
        Domain domain = domainOptional.get();

        // Check for duplicate vertical name within this domain
        Optional<Vertical> existingVertical = verticalRepository.findByVerticalNameAndDomain(verticalDto.getVerticalName(), domain);
        if (existingVertical.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value()) // 409 Conflict
                    .message("Vertical with name '" + verticalDto.getVerticalName() + "' already exists in domain '" + verticalDto.getDomainName() + "'.")
                    .build();
        }

        Vertical vertical = modelMapper.map(verticalDto, Vertical.class);
        vertical.setDomain(domain); // Set the associated Domain entity

        Vertical savedVertical = verticalRepository.save(vertical);

        // Convert the saved entity back to DTO for response
        VerticalDto savedVerticalDto = modelMapper.map(savedVertical, VerticalDto.class);
        // Manually set domainName in DTO since ModelMapper won't do it from nested object by default
        savedVerticalDto.setDomainName(savedVertical.getDomain().getDomainName());

        return Response.builder()
                .status(HttpStatus.CREATED.value()) // 201 Created
                .message("Vertical added successfully.")
               // .vertical(savedVerticalDto)
                .build();
    }

    @Override
    public Response getAllVerticals() {
        List<Vertical> verticals = verticalRepository.findAll();
        if (verticals.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("No verticals found.")
                    .build();
        }
        List<VerticalDto> verticalDtos = verticals.stream()
                .map(vertical -> {
                    VerticalDto dto = modelMapper.map(vertical, VerticalDto.class);
                    // Manually set domainName in DTO
                    if (vertical.getDomain() != null) {
                        dto.setDomainName(vertical.getDomain().getDomainName());
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        return Response.builder()
                .status(HttpStatus.OK.value()) // 200 OK
                .message("All verticals retrieved successfully.")
                .verticalList(verticalDtos)
                .build();
    }

    @Override
    public Response getVerticalById(Long id) {
        Optional<Vertical> verticalOptional = verticalRepository.findById(id);
        if (verticalOptional.isPresent()) {
            Vertical vertical = verticalOptional.get();
            VerticalDto verticalDto = modelMapper.map(vertical, VerticalDto.class);
            // Manually set domainName in DTO
            if (vertical.getDomain() != null) {
                verticalDto.setDomainName(vertical.getDomain().getDomainName());
            }
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Vertical retrieved successfully by ID.")
                    .vertical(verticalDto)
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Vertical with ID " + id + " not found.")
                    .build();
        }
    }

    @Override
    public Response getVerticalByName(String name) {
        // Note: This method assumes `verticalName` is unique globally, or you'd need to provide `domainName` as well.
        // If verticalName is only unique *within* a domain, you'll need another method signature like `getVerticalByNameAndDomainName`
        Optional<Vertical> verticalOptional = verticalRepository.findByVerticalName(name);
        if (verticalOptional.isPresent()) {
            Vertical vertical = verticalOptional.get();
            VerticalDto verticalDto = modelMapper.map(vertical, VerticalDto.class);
            // Manually set domainName in DTO
            if (vertical.getDomain() != null) {
                verticalDto.setDomainName(vertical.getDomain().getDomainName());
            }
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Vertical retrieved successfully by name.")
                    .vertical(verticalDto)
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Vertical with name '" + name + "' not found.")
                    .build();
        }
    }

    @Override
    public Response updateVertical(Long id, VerticalDto verticalDto) {
        Optional<Vertical> existingVerticalOptional = verticalRepository.findById(id);
        if (existingVerticalOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Vertical with ID " + id + " not found for update.")
                    .build();
        }
        Vertical existingVertical = existingVerticalOptional.get();

        // Find the new Domain by its name
        Optional<Domain> domainOptional = domainRepository.findByDomainName(verticalDto.getDomainName());
        if (domainOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Domain with name '" + verticalDto.getDomainName() + "' not found for update. Please ensure the domain exists.")
                    .build();
        }
        Domain newDomain = domainOptional.get();

        // Check for duplicate vertical name with the new domain (if name or domain changes)
        // This is a crucial check to prevent unique constraint violations after an update.
        if (!existingVertical.getVerticalName().equals(verticalDto.getVerticalName()) ||
            !existingVertical.getDomain().getDomainId().equals(newDomain.getDomainId())) { // Compare Domain IDs for change
            Optional<Vertical> verticalWithSameNameAndDomain = verticalRepository.findByVerticalNameAndDomain(verticalDto.getVerticalName(), newDomain);
            if (verticalWithSameNameAndDomain.isPresent() && !verticalWithSameNameAndDomain.get().getVerticalId().equals(id)) {
                return Response.builder()
                        .status(HttpStatus.CONFLICT.value())
                        .message("Vertical with name '" + verticalDto.getVerticalName() + "' already exists in domain '" + verticalDto.getDomainName() + "' for another record.")
                        .build();
            }
        }

        // Update existing entity properties from DTO (ModelMapper handles simple field mapping)
        modelMapper.map(verticalDto, existingVertical);
        existingVertical.setDomain(newDomain); // Set the new associated Domain entity
        existingVertical.setVerticalId(id); // Ensure the ID from the path is retained

        Vertical updatedVertical = verticalRepository.save(existingVertical);

        // Convert the updated entity back to DTO for response
        VerticalDto updatedVerticalDto = modelMapper.map(updatedVertical, VerticalDto.class);
        // Manually set domainName in DTO
        updatedVerticalDto.setDomainName(updatedVertical.getDomain().getDomainName());

        return Response.builder()
                .status(HttpStatus.OK.value()) // 200 OK
                .message("Vertical updated successfully.")
                .vertical(updatedVerticalDto)
                .build();
    }

    @Override
    public Response deleteVertical(Long id) {
        Optional<Vertical> existingVerticalOptional = verticalRepository.findById(id);
        if (existingVerticalOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Vertical with ID " + id + " not found for deletion.")
                    .build();
        }
        verticalRepository.deleteById(id);
        return Response.builder()
                .status(HttpStatus.OK.value()) // 204 No Content
                .message("Vertical deleted successfully.")
                .build();
    }
}