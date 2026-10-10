package com.saran.TraineeManagementSystem.services.serviceImpl;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.TraineeDto;
import com.saran.TraineeManagementSystem.models.*;
import com.saran.TraineeManagementSystem.Repositories.*;
import com.saran.TraineeManagementSystem.services.TraineeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional; // Import Optional
import java.util.stream.Collectors;

@Service

public class TraineeServiceImpl implements TraineeService {

    private final TraineeRepository traineeRepository;
    private final DomainRepository domainRepository;
    private final CohortRepository cohortRepository;
    private final ModelMapper modelMapper;
    
    public TraineeServiceImpl(TraineeRepository traineeRepository, DomainRepository domainRepository, CohortRepository cohortRepository, ModelMapper modelMapper) {
        this.traineeRepository = traineeRepository;
        this.domainRepository = domainRepository;
        this.cohortRepository = cohortRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Response addTrainee(TraineeDto traineeDto) {
        // Check if a trainee with the same associate ID or email already exists to prevent duplicates
        Optional<Trainee> existingByAssociateId = traineeRepository.findByTraineeAssociateId(traineeDto.getTraineeAssociateId());
        if (existingByAssociateId.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value())
                    .message("Trainee with associate ID " + traineeDto.getTraineeAssociateId() + " already exists.")
                    .build();
        }

        // Assuming email should also be unique if it's a primary contact
         Optional<Trainee> existingByEmail = traineeRepository.findByTraineeEmail(traineeDto.getTraineeEmail());
         if (existingByEmail.isPresent()) {
             return Response.builder()
                     .status(HttpStatus.CONFLICT.value())
                     .message("Trainee with email " + traineeDto.getTraineeEmail() + " already exists.")
                     .build();
         }

        Trainee trainee = modelMapper.map(traineeDto, Trainee.class);
        // Map domain by name if provided
        if (traineeDto.getDomainName() != null && !traineeDto.getDomainName().isBlank()) {
            Optional<Domain> domainOpt = domainRepository.findByDomainName(traineeDto.getDomainName());
            domainOpt.ifPresent(trainee::setDomain);
        }
        // Skills copied as-is from DTO (comma-separated)
        trainee.setSkills(traineeDto.getSkills());
        // Optionally link to cohort if provided
        if (traineeDto.getCohortId() != null) {
            cohortRepository.findById(traineeDto.getCohortId()).ifPresent(trainee::setCohort);
        }
        Trainee savedTrainee = traineeRepository.save(trainee);

        return Response.builder()
                .status(HttpStatus.CREATED.value())
                .message("Trainee added successfully.")
                //.trainee(modelMapper.map(savedTrainee, TraineeDto.class)) // Return the saved DTO
                .build();
    }

    @Override
    public Response getAllTrainees() {
        List<Trainee> trainees = traineeRepository.findAll();
        if (trainees.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No Trainees found.")
                    .build();
        }
        List<TraineeDto> traineeDtos = trainees.stream()
                .map(trainee -> modelMapper.map(trainee, TraineeDto.class))
                .collect(Collectors.toList());

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("All Trainees retrieved successfully.")
                .traineeList(traineeDtos)
                .build();
    }

    @Override
    public Response getTraineeById(Long id) {
        Optional<Trainee> traineeOptional = traineeRepository.findById(id);
        if (traineeOptional.isPresent()) {
            TraineeDto traineeDto = modelMapper.map(traineeOptional.get(), TraineeDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Trainee retrieved successfully by ID.")
                    .trainee(traineeDto)
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Trainee with ID " + id + " not found.")
                    .build();
        }
    }

    @Override
    public Response getTraineeByName(String name) {
        // findByTraineeName now returns Optional<List<Trainee>>
        Optional<List<Trainee>> traineesOptional = traineeRepository.findByTraineeName(name);

        if (traineesOptional.isPresent() && !traineesOptional.get().isEmpty()) {
            List<TraineeDto> traineeDtos = traineesOptional.get().stream()
                    .map(trainee -> modelMapper.map(trainee, TraineeDto.class))
                    .collect(Collectors.toList());
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Trainees retrieved successfully by name.")
                    .traineeList(traineeDtos)
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No Trainees found with name " + name + ".")
                    .build();
        }
    }

    @Override
    public Response getTraineeByAssociateId(String associateId) {
        Optional<Trainee> traineeOptional = traineeRepository.findByTraineeAssociateId(associateId);
        if (traineeOptional.isPresent()) {
            TraineeDto traineeDto = modelMapper.map(traineeOptional.get(), TraineeDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Trainee retrieved successfully by Associate ID.")
                    .trainee(traineeDto)
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Trainee with Associate ID " + associateId + " not found.")
                    .build();
        }
    }

    @Override
    public Response updateTrainee(Long id, TraineeDto traineeDto) {
        Optional<Trainee> existingTraineeOptional = traineeRepository.findById(id);
        if (existingTraineeOptional.isPresent()) {
            Trainee existingTrainee = existingTraineeOptional.get();

            // Use ModelMapper to update the existing entity from the DTO
            modelMapper.map(traineeDto, existingTrainee);
            // Ensure the ID from the path is retained (ModelMapper might overwrite if DTO has an ID field)
            existingTrainee.setTraineeId(id);

            // Update domain by name if provided
            if (traineeDto.getDomainName() != null && !traineeDto.getDomainName().isBlank()) {
                domainRepository.findByDomainName(traineeDto.getDomainName()).ifPresent(existingTrainee::setDomain);
            }
            // Update skills
            if (traineeDto.getSkills() != null) {
                existingTrainee.setSkills(traineeDto.getSkills());
            }
            // Update cohort assignment if provided
            if (traineeDto.getCohortId() != null) {
                cohortRepository.findById(traineeDto.getCohortId()).ifPresent(existingTrainee::setCohort);
            }

            Trainee updatedTrainee = traineeRepository.save(existingTrainee);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Trainee updated successfully.")
                    .trainee(modelMapper.map(updatedTrainee, TraineeDto.class)) // Return the updated DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Trainee with ID " + id + " not found for update.")
                    .build();
        }
    }

    @Override
    public Response deleteTrainee(Long id) {
        Optional<Trainee> existingTraineeOptional = traineeRepository.findById(id);
        if (existingTraineeOptional.isPresent()) {
            traineeRepository.deleteById(id);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 204 No Content for successful deletion
                    .message("Trainee deleted successfully.")
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Trainee with ID " + id + " not found for deletion.")
                    .build();
        }
    }

    @Override
    public Response listFiltered(String domainName, String skillsLike, Boolean unassignedOnly) {
        List<Trainee> trainees = traineeRepository.findAll();
        List<Trainee> filtered = trainees.stream()
            .filter(t -> domainName == null || (t.getDomain() != null && domainName.equalsIgnoreCase(t.getDomain().getDomainName())))
            .filter(t -> skillsLike == null || (t.getSkills() != null && t.getSkills().toLowerCase().contains(skillsLike.toLowerCase())))
            .filter(t -> unassignedOnly == null || !unassignedOnly || t.getCohort() == null)
            .collect(Collectors.toList());

        List<TraineeDto> dtos = filtered.stream().map(t -> {
            TraineeDto dto = modelMapper.map(t, TraineeDto.class);
            if (t.getDomain() != null) dto.setDomainName(t.getDomain().getDomainName());
            if (t.getCohort() != null) dto.setCohortId(t.getCohort().getCohortId());
            return dto;
        }).collect(Collectors.toList());

        return Response.builder()
            .status(HttpStatus.OK.value())
            .message("Filtered trainees retrieved")
            .traineeList(dtos)
            .build();
    }

    @Override
    public Response assignToCohort(List<Long> traineeIds, Long cohortId) {
        Optional<Cohort> cohortOpt = cohortRepository.findById(cohortId);
        if (cohortOpt.isEmpty()) {
            return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("Cohort not found").build();
        }
        Cohort cohort = cohortOpt.get();
        List<Trainee> trainees = traineeRepository.findAllById(traineeIds);
        if (trainees.isEmpty()) {
            return Response.builder().status(HttpStatus.BAD_REQUEST.value()).message("No valid trainee IDs provided").build();
        }
        trainees.forEach(t -> t.setCohort(cohort));
        traineeRepository.saveAll(trainees);

        return Response.builder()
            .status(HttpStatus.OK.value())
            .message("Trainees assigned to cohort")
            .build();
    }

    @Override
    public Response bulkUpsert(List<TraineeDto> trainees, Boolean updateExisting) {
        // Bulk upsert contract:
        // - Match existing records by associateId first, else by email
        // - If no match: create a new Trainee
        // - If match and updateExisting=true: update minimal, safe-to-override fields
        // - If match and updateExisting=false: skip
        // - Map domain by domainName (if provided), link cohort by cohortId (if provided), copy skills (CSV string)
        // Returns a Response with a human-readable summary of counts.
        if (trainees == null || trainees.isEmpty()) {
            return Response.builder().status(HttpStatus.BAD_REQUEST.value()).message("No trainees provided").build();
        }
        boolean doUpdate = updateExisting == null ? true : updateExisting.booleanValue();
        int created = 0, updated = 0, skipped = 0, failed = 0;
        java.util.ArrayList<com.saran.TraineeManagementSystem.Dtos.BulkRowResultDto> results = new java.util.ArrayList<>();

        for (int i = 0; i < trainees.size(); i++) {
            TraineeDto dto = trainees.get(i);
            try {
                // 1) Try to find an existing trainee using associateId, falling back to email
                Optional<Trainee> byAssoc = dto.getTraineeAssociateId() != null ? traineeRepository.findByTraineeAssociateId(dto.getTraineeAssociateId()) : Optional.empty();
                Optional<Trainee> byEmail = (!byAssoc.isPresent() && dto.getTraineeEmail() != null) ? traineeRepository.findByTraineeEmail(dto.getTraineeEmail()) : Optional.empty();

                Trainee entity = byAssoc.or(() -> byEmail).orElse(null);
                if (entity == null) {
                    // 2) No match found: create a new Trainee from DTO
                    entity = modelMapper.map(dto, Trainee.class);
                    // Map domain by exact domainName match (if provided)
                    if (dto.getDomainName() != null && !dto.getDomainName().isBlank()) {
                        domainRepository.findByDomainName(dto.getDomainName()).ifPresent(entity::setDomain);
                    }
                    // Copy skills text as-is (comma-separated string)
                    entity.setSkills(dto.getSkills());
                    // Link cohort by id (if provided)
                    if (dto.getCohortId() != null) {
                        cohortRepository.findById(dto.getCohortId()).ifPresent(entity::setCohort);
                    }
                    traineeRepository.save(entity);
                    created++;
                    results.add(new com.saran.TraineeManagementSystem.Dtos.BulkRowResultDto(
                        i, dto.getTraineeAssociateId(), dto.getTraineeEmail(), "CREATED", null
                    ));
                } else if (doUpdate) {
                    // 3) Match found and updates allowed: refresh minimal fields
                    // Only override fields present in the DTO to avoid destructive changes
                    if (dto.getTraineeName() != null) entity.setTraineeName(dto.getTraineeName());
                    if (dto.getTraineeEmail() != null) entity.setTraineeEmail(dto.getTraineeEmail());
                    if (dto.getDomainName() != null && !dto.getDomainName().isBlank()) {
                        domainRepository.findByDomainName(dto.getDomainName()).ifPresent(entity::setDomain);
                    }
                    if (dto.getSkills() != null) entity.setSkills(dto.getSkills());
                    if (dto.getCohortId() != null) {
                        cohortRepository.findById(dto.getCohortId()).ifPresent(entity::setCohort);
                    }
                    traineeRepository.save(entity);
                    updated++;
                    results.add(new com.saran.TraineeManagementSystem.Dtos.BulkRowResultDto(
                        i, dto.getTraineeAssociateId(), dto.getTraineeEmail(), "UPDATED", null
                    ));
                } else {
                    // 4) Match found but updates disabled: count as skipped
                    skipped++;
                    results.add(new com.saran.TraineeManagementSystem.Dtos.BulkRowResultDto(
                        i, dto.getTraineeAssociateId(), dto.getTraineeEmail(), "SKIPPED", "Existing record found and updateExisting=false"
                    ));
                }
            } catch (Exception ex) {
                // Defensive catch-all so one bad row doesn't abort the entire batch
                failed++;
                results.add(new com.saran.TraineeManagementSystem.Dtos.BulkRowResultDto(
                    i, dto.getTraineeAssociateId(), dto.getTraineeEmail(), "FAILED", ex.getMessage()
                ));
            }
        }

        String msg = String.format("Bulk upsert complete. Created: %d, Updated: %d, Skipped: %d, Failed: %d", created, updated, skipped, failed);
        return Response.builder().status(HttpStatus.OK.value()).message(msg).bulkResults(results).build();
    }
}