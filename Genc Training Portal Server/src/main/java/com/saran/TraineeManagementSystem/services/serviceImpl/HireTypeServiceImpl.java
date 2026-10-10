package com.saran.TraineeManagementSystem.services.serviceImpl;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.HireTypeDto;
import com.saran.TraineeManagementSystem.models.HireType;
import com.saran.TraineeManagementSystem.Repositories.*;
import com.saran.TraineeManagementSystem.services.HireTypeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HireTypeServiceImpl implements HireTypeService {

    private final HireTypeRepository hireTypeRepository;
    private final ModelMapper modelMapper;
    
    public HireTypeServiceImpl(HireTypeRepository hireTypeRepository, ModelMapper modelMapper) {
        this.hireTypeRepository = hireTypeRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Response addHireType(HireTypeDto hireTypeDto) {
        // Check for duplicate hire type name before adding
        Optional<HireType> existingHireType = hireTypeRepository.findByHireType(hireTypeDto.getHireType());
        if (existingHireType.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value()) // 409 Conflict
                    .message("Hire type '" + hireTypeDto.getHireType() + "' already exists.")
                    .build();
        }

        HireType hireType = modelMapper.map(hireTypeDto, HireType.class);
        HireType savedHireType = hireTypeRepository.save(hireType);

        return Response.builder()
                .status(HttpStatus.CREATED.value()) // 201 Created
                .message("Hire type added successfully.")
                //.hireType(modelMapper.map(savedHireType, HireTypeDto.class)) // Return the saved DTO
                .build();
    }

    @Override
    public Response getAllHireTypes() {
        List<HireType> hireTypes = hireTypeRepository.findAll();
        if (hireTypes.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("No hire types found.")
                    .build();
        }
        List<HireTypeDto> hireTypeDtos = hireTypes.stream()
                .map(hireType -> modelMapper.map(hireType, HireTypeDto.class))
                .collect(Collectors.toList());

        return Response.builder()
                .status(HttpStatus.OK.value()) // 200 OK
                .message("All hire types retrieved successfully.")
                .hireTypeList(hireTypeDtos) // Returning the list of DTOs
                .build();
    }

    @Override
    public Response getHireTypeById(Long id) {
        Optional<HireType> hireTypeOptional = hireTypeRepository.findById(id);
        if (hireTypeOptional.isPresent()) {
            HireTypeDto hireTypeDto = modelMapper.map(hireTypeOptional.get(), HireTypeDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Hire type retrieved successfully by ID.")
                    .hireType(hireTypeDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Hire type with ID " + id + " not found.")
                    .build();
        }
    }

    @Override
    public Response getHireTypeByType(String type) {
        Optional<HireType> hireTypeOptional = hireTypeRepository.findByHireType(type);
        if (hireTypeOptional.isPresent()) {
            HireTypeDto hireTypeDto = modelMapper.map(hireTypeOptional.get(), HireTypeDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Hire type retrieved successfully by type name.")
                    .hireType(hireTypeDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Hire type '" + type + "' not found.")
                    .build();
        }
    }

    @Override
    public Response updateHireType(Long id, HireTypeDto hireTypeDto) {
        Optional<HireType> existingHireTypeOptional = hireTypeRepository.findById(id);
        if (existingHireTypeOptional.isPresent()) {
            HireType existingHireType = existingHireTypeOptional.get();

            // Check if the new type name conflicts with another existing hire type (excluding itself)
            Optional<HireType> hireTypeWithSameName = hireTypeRepository.findByHireType(hireTypeDto.getHireType());
            if (hireTypeWithSameName.isPresent() && !hireTypeWithSameName.get().getHireTypeId().equals(id)) {
                return Response.builder()
                        .status(HttpStatus.CONFLICT.value())
                        .message("Hire type '" + hireTypeDto.getHireType() + "' already exists for another ID.")
                        .build();
            }

            // Update existing entity properties from DTO
            modelMapper.map(hireTypeDto, existingHireType);
            // Ensure the ID from the path is retained
            existingHireType.setHireTypeId(id); // Important to ensure we update the correct record

            HireType updatedHireType = hireTypeRepository.save(existingHireType);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Hire type updated successfully.")
                    .hireType(modelMapper.map(updatedHireType, HireTypeDto.class)) // Return the updated DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Hire type with ID " + id + " not found for update.")
                    .build();
        }
    }

    @Override
    public Response deleteHireType(Long id) {
        Optional<HireType> existingHireTypeOptional = hireTypeRepository.findById(id);
        if (existingHireTypeOptional.isPresent()) {
            hireTypeRepository.deleteById(id);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 204 No Content
                    .message("Hire type deleted successfully.")
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Hire type with ID " + id + " not found for deletion.")
                    .build();
        }
    }
}