package com.saran.TraineeManagementSystem.services.serviceImpl; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.BhTrainerDto;
import com.saran.TraineeManagementSystem.Dtos.Response;

import com.saran.TraineeManagementSystem.models.BHTrainer;
import com.saran.TraineeManagementSystem.Repositories.*;
import com.saran.TraineeManagementSystem.services.BHTrainerService; // Adjust package if different

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BHTrainerServiceImpl implements BHTrainerService {

    private final BHTrainerRepository bhTrainerRepository;
    private final ModelMapper modelMapper;
    
    public BHTrainerServiceImpl(BHTrainerRepository bhTrainerRepository, ModelMapper modelMapper) {
		super();
		this.bhTrainerRepository = bhTrainerRepository;
		this.modelMapper = modelMapper;
	}

	@Override
    public Response addBHTrainer(BhTrainerDto bhTrainerDto) {
        // Check for duplicate Associate ID or Email before adding
        if (bhTrainerRepository.findByBhTrainerAssociateId(bhTrainerDto.getBhTrainerAssociateId()).isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value()) // 409 Conflict
                    .message("BH Trainer with Associate ID '" + bhTrainerDto.getBhTrainerAssociateId() + "' already exists.")
                    .build();
        }
        if (bhTrainerRepository.findByBhTrainerEmail(bhTrainerDto.getBhTrainerEmail()).isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value()) // 409 Conflict
                    .message("BH Trainer with email '" + bhTrainerDto.getBhTrainerEmail() + "' already exists.")
                    .build();
        }

        BHTrainer bhTrainer = modelMapper.map(bhTrainerDto, BHTrainer.class);
        BHTrainer savedBHTrainer = bhTrainerRepository.save(bhTrainer);

        return Response.builder()
                .status(HttpStatus.CREATED.value()) // 201 Created
                .message("BH Trainer added successfully.")
                .bhTrainer(modelMapper.map(savedBHTrainer, BhTrainerDto.class)) // Return the saved DTO
                .build();
    }

    @Override
    public Response getAllBHTrainers() {
        List<BHTrainer> bhTrainers = bhTrainerRepository.findAll();
        if (bhTrainers.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("No BH Trainers found.")
                    .build();
        }
        List<BhTrainerDto> bhTrainerDtos = bhTrainers.stream()
                .map(bhTrainer -> modelMapper.map(bhTrainer, BhTrainerDto.class))
                .collect(Collectors.toList());

        return Response.builder()
                .status(HttpStatus.OK.value()) // 200 OK
                .message("All BH Trainers retrieved successfully.")
                .bhTrainerList(bhTrainerDtos) // Returning the list of DTOs
                .build();
    }

    @Override
    public Response getBHTrainerById(Long id) {
        Optional<BHTrainer> bhTrainerOptional = bhTrainerRepository.findById(id);
        if (bhTrainerOptional.isPresent()) {
            BhTrainerDto bhTrainerDto = modelMapper.map(bhTrainerOptional.get(), BhTrainerDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("BH Trainer retrieved successfully by ID.")
                    .bhTrainer(bhTrainerDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("BH Trainer with ID " + id + " not found.")
                    .build();
        }
    }

    @Override
    public Response getBHTrainerByName(String name) {
        // Assuming findByBhTrainerName returns Optional<BHTrainer>
        Optional<BHTrainer> bhTrainerOptional = bhTrainerRepository.findByBhTrainerName(name);
        if (bhTrainerOptional.isPresent()) {
            BhTrainerDto bhTrainerDto = modelMapper.map(bhTrainerOptional.get(), BhTrainerDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("BH Trainer retrieved successfully by name.")
                    .bhTrainer(bhTrainerDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("BH Trainer with name '" + name + "' not found.")
                    .build();
        }
    }

    @Override
    public Response getBHTrainerByAssociateId(String associateId) {
        Optional<BHTrainer> bhTrainerOptional = bhTrainerRepository.findByBhTrainerAssociateId(associateId);
        if (bhTrainerOptional.isPresent()) {
            BhTrainerDto bhTrainerDto = modelMapper.map(bhTrainerOptional.get(), BhTrainerDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("BH Trainer retrieved successfully by Associate ID.")
                    .bhTrainer(bhTrainerDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("BH Trainer with Associate ID '" + associateId + "' not found.")
                    .build();
        }
    }

    @Override
    public Response getBHTrainerByEmail(String email) {
        Optional<BHTrainer> bhTrainerOptional = bhTrainerRepository.findByBhTrainerEmail(email);
        if (bhTrainerOptional.isPresent()) {
            BhTrainerDto bhTrainerDto = modelMapper.map(bhTrainerOptional.get(), BhTrainerDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("BH Trainer retrieved successfully by Email.")
                    .bhTrainer(bhTrainerDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("BH Trainer with Email '" + email + "' not found.")
                    .build();
        }
    }

    @Override
    public Response updateBHTrainer(Long id, BhTrainerDto bhTrainerDto) {
        Optional<BHTrainer> existingBHTrainerOptional = bhTrainerRepository.findById(id);
        if (existingBHTrainerOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("BH Trainer with ID " + id + " not found for update.")
                    .build();
        }
        BHTrainer existingBHTrainer = existingBHTrainerOptional.get();

        // Check for duplicate Associate ID or Email if they are being changed to an existing one (excluding current trainer)
        if (!existingBHTrainer.getBhTrainerAssociateId().equals(bhTrainerDto.getBhTrainerAssociateId())) {
            if (bhTrainerRepository.findByBhTrainerAssociateId(bhTrainerDto.getBhTrainerAssociateId()).isPresent()) {
                return Response.builder()
                        .status(HttpStatus.CONFLICT.value())
                        .message("Associate ID '" + bhTrainerDto.getBhTrainerAssociateId() + "' already exists for another BH Trainer.")
                        .build();
            }
        }
        if (!existingBHTrainer.getBhTrainerEmail().equals(bhTrainerDto.getBhTrainerEmail())) {
            if (bhTrainerRepository.findByBhTrainerEmail(bhTrainerDto.getBhTrainerEmail()).isPresent()) {
                return Response.builder()
                        .status(HttpStatus.CONFLICT.value())
                        .message("Email '" + bhTrainerDto.getBhTrainerEmail() + "' already exists for another BH Trainer.")
                        .build();
            }
        }

        // Update existing entity properties from DTO
        modelMapper.map(bhTrainerDto, existingBHTrainer);
        existingBHTrainer.setBhTrainerId(id); // Ensure the ID from the path is retained

        BHTrainer updatedBHTrainer = bhTrainerRepository.save(existingBHTrainer);

        return Response.builder()
                .status(HttpStatus.OK.value()) // 200 OK
                .message("BH Trainer updated successfully.")
                .bhTrainer(modelMapper.map(updatedBHTrainer, BhTrainerDto.class)) // Return the updated DTO
                .build();
    }

    @Override
    public Response deleteBHTrainer(Long id) {
        Optional<BHTrainer> existingBHTrainerOptional = bhTrainerRepository.findById(id);
        if (existingBHTrainerOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("BH Trainer with ID " + id + " not found for deletion.")
                    .build();
        }
        bhTrainerRepository.deleteById(id);
        return Response.builder()
                .status(HttpStatus.OK.value()) // 204 No Content
                .message("BH Trainer deleted successfully.")
                .build();
    }

	
}
