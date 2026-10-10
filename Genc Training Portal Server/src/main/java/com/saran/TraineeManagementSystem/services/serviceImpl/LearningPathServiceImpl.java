package com.saran.TraineeManagementSystem.services.serviceImpl;
 
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.LearningPathDto;
import com.saran.TraineeManagementSystem.Dtos.LearningPathBatchRequestDto;
import com.saran.TraineeManagementSystem.Dtos.LearningPathDayDetailDto;
import com.saran.TraineeManagementSystem.Exceptions.ResourceNotFoundException;
import com.saran.TraineeManagementSystem.models.LearningPath;
import com.saran.TraineeManagementSystem.models.LearningPathDayEntry; // New entity
import com.saran.TraineeManagementSystem.models.ServiceLine;
import com.saran.TraineeManagementSystem.Repositories.LearningPathRepository;
import com.saran.TraineeManagementSystem.Repositories.LearningPathDayEntryRepository; // New repository
import com.saran.TraineeManagementSystem.Repositories.ServiceLineRepository;
import com.saran.TraineeManagementSystem.services.LearningPathService;
 
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper;
 
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
 
@Service
public class LearningPathServiceImpl implements LearningPathService {
 
    private final LearningPathRepository learningPathRepository;
    private final LearningPathDayEntryRepository learningPathDayEntryRepository; // Inject new repo
    private final ServiceLineRepository serviceLineRepository;
    private final ModelMapper modelMapper;
 
    @Autowired
    public LearningPathServiceImpl(LearningPathRepository learningPathRepository,
                                   LearningPathDayEntryRepository learningPathDayEntryRepository,
                                   ServiceLineRepository serviceLineRepository, ModelMapper modelMapper) {
        this.learningPathRepository = learningPathRepository;
        this.learningPathDayEntryRepository = learningPathDayEntryRepository;
        this.serviceLineRepository = serviceLineRepository;
        this.modelMapper = modelMapper;
    }


    @Override
    public Response createOrUpdateLearningPath(LearningPathBatchRequestDto requestDto) {
        Optional<ServiceLine> serviceLineOptional = serviceLineRepository.findByTrackName(requestDto.getServiceLineName());
        if (serviceLineOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Service Line with name '" + requestDto.getServiceLineName() + "' not found.")
                    .build();
        }
        ServiceLine serviceLine = serviceLineOptional.get();

        Optional<LearningPath> existingMasterLearningPath = learningPathRepository.findByServiceLine(serviceLine);
        LearningPath masterLearningPath;

        if (existingMasterLearningPath.isPresent()) {
            masterLearningPath = existingMasterLearningPath.get();

            masterLearningPath.getDayEntries().clear();
            masterLearningPath.setDurationWeeks(requestDto.getTotalDurationWeeks());
        } else {
            masterLearningPath = new LearningPath();
            masterLearningPath.setServiceLine(serviceLine);
            masterLearningPath.setDurationWeeks(requestDto.getTotalDurationWeeks());
        }


        List<LearningPathDayEntry> newDayEntries = new ArrayList<>();
        for (LearningPathDayDetailDto dayDetailDto : requestDto.getDayDetails()) {
            LearningPathDayEntry dayEntry = modelMapper.map(dayDetailDto, LearningPathDayEntry.class);
            dayEntry.setLearningPath(masterLearningPath);
            newDayEntries.add(dayEntry);
        }


        masterLearningPath.setDayEntries(newDayEntries);


        LearningPath savedMasterPath = learningPathRepository.save(masterLearningPath);


        LearningPathDto responseDto = modelMapper.map(savedMasterPath, LearningPathDto.class);
        responseDto.setServiceLineName(savedMasterPath.getServiceLine().getTrackName());


        List<LearningPathDayDetailDto> savedDayDetailsDtos = savedMasterPath.getDayEntries().stream()
                .map(dayEntry -> modelMapper.map(dayEntry, LearningPathDayDetailDto.class))
                .collect(Collectors.toList());
        responseDto.setDayDetails(savedDayDetailsDtos);

        return Response.builder()
                .status(HttpStatus.CREATED.value())
                .message("Learning path and " + savedMasterPath.getDayEntries().size() + " day entries created/updated successfully for Service Line '" + serviceLine.getTrackName() + "'.")
                .learningPath(responseDto)
                .build();
    }

//    @Override
//    @Transactional
//    public Response createOrUpdateLearningPath(LearningPathBatchRequestDto requestDto) {
//        Optional<ServiceLine> serviceLineOptional = serviceLineRepository.findByTrackName(requestDto.getServiceLineName());
//        if (serviceLineOptional.isEmpty()) {
//            return Response.builder()
//                    .status(HttpStatus.NOT_FOUND.value())
//                    .message("Service Line with name '" + requestDto.getServiceLineName() + "' not found.")
//                    .build();
//        }
//        ServiceLine serviceLine = serviceLineOptional.get();
//
//        Optional<LearningPath> existingMasterLearningPath = learningPathRepository.findByServiceLine(serviceLine);
//        LearningPath masterLearningPath;
//
//        if (existingMasterLearningPath.isPresent()) {
//            masterLearningPath = existingMasterLearningPath.get();
//
//            // ✅ Clear existing entries properly
//            masterLearningPath.clearDayEntries();
//
//            masterLearningPath.setDurationWeeks(requestDto.getTotalDurationWeeks());
//        } else {
//            masterLearningPath = new LearningPath();
//            masterLearningPath.setServiceLine(serviceLine);
//            masterLearningPath.setDurationWeeks(requestDto.getTotalDurationWeeks());
//        }
//
//        // ✅ Add new day entries without replacing the collection
//        for (LearningPathDayDetailDto dayDetailDto : requestDto.getDayDetails()) {
//            LearningPathDayEntry dayEntry = modelMapper.map(dayDetailDto, LearningPathDayEntry.class);
//            masterLearningPath.addDayEntry(dayEntry);
//        }
//
//        // ✅ Save the updated LearningPath
//        LearningPath savedMasterPath = learningPathRepository.save(masterLearningPath);
//
//        // ✅ Prepare the response
//        LearningPathDto responseDto = modelMapper.map(savedMasterPath, LearningPathDto.class);
//        responseDto.setServiceLineName(savedMasterPath.getServiceLine().getTrackName());
//
//        List<LearningPathDayDetailDto> savedDayDetailsDtos = savedMasterPath.getDayEntries().stream()
//                .map(dayEntry -> modelMapper.map(dayEntry, LearningPathDayDetailDto.class))
//                .collect(Collectors.toList());
//        responseDto.setDayDetails(savedDayDetailsDtos);
//
//        return Response.builder()
//                .status(HttpStatus.CREATED.value())
//                .message("Learning path and " + savedMasterPath.getDayEntries().size() + " day entries created/updated successfully for Service Line '" + serviceLine.getTrackName() + "'.")
//                .learningPath(responseDto)
//                .build();
//    }


//    @Override
//    public Response updateLearningPathById(Long learningPathId, LearningPathBatchRequestDto requestDto) {
//        // 1. Find the existing LearningPath by ID
//        Optional<LearningPath> existingLearningPathOptional = learningPathRepository.findById(learningPathId);
//
//        if (existingLearningPathOptional.isEmpty()) {
//            return Response.builder()
//                    .status(HttpStatus.NOT_FOUND.value())
//                    .message("Learning Path with ID '" + learningPathId + "' not found for update.")
//                    .build();
//        }
//
//        LearningPath masterLearningPath = existingLearningPathOptional.get();
//
//        // 2. Validate Service Line (if serviceLineName can change or needs re-validation)
//        Optional<ServiceLine> serviceLineOptional = serviceLineRepository.findByTrackName(requestDto.getServiceLineName());
//        if (serviceLineOptional.isEmpty()) {
//            return Response.builder()
//                    .status(HttpStatus.NOT_FOUND.value())
//                    .message("Service Line with name '" + requestDto.getServiceLineName() + "' not found. Cannot update learning path.")
//                    .build();
//        }
//        ServiceLine newServiceLine = serviceLineOptional.get();
//
//        // If the serviceLineName *can* be changed for an existing LearningPath:
//        masterLearningPath.setServiceLine(newServiceLine); // Update associated service line if changed
//
//        // 3. Update the main LearningPath fields
//        masterLearningPath.setDurationWeeks(requestDto.getTotalDurationWeeks());
//
//        // 4. Handle day entries:
//        // Clear existing day entries to replace them with the new ones from the DTO.
//        // This is a common strategy for child collections when the parent is updated.
//        // Ensure you have CascadeType.ALL and orphanRemoval = true on @OneToMany in LearningPath entity
//        // OR manually delete old entries if not using orphanRemoval.
//        if (masterLearningPath.getDayEntries() != null) {
//            masterLearningPath.getDayEntries().clear(); // Clear existing entries
//        } else {
//            masterLearningPath.setDayEntries(new ArrayList<>()); // Initialize if null
//        }
//
//
//        List<LearningPathDayEntry> newDayEntries = new ArrayList<>();
//        for (LearningPathDayDetailDto dayDetailDto : requestDto.getDayDetails()) {
//            LearningPathDayEntry dayEntry = modelMapper.map(dayDetailDto, LearningPathDayEntry.class);
//            dayEntry.setLearningPath(masterLearningPath); // Set the parent reference
//            newDayEntries.add(dayEntry);
//        }
//        masterLearningPath.setDayEntries(newDayEntries); // Set the new list of day entries
//
//        // 5. Save the updated LearningPath
//        LearningPath savedMasterPath = learningPathRepository.save(masterLearningPath);
//        // Note: With cascade types correctly configured, saving the master path
//        // will also handle the day entries (inserting new, deleting old).
//
//        // 6. Prepare and return the response DTO
//        LearningPathDto responseDto = modelMapper.map(savedMasterPath, LearningPathDto.class);
//        responseDto.setServiceLineName(savedMasterPath.getServiceLine().getTrackName());
//        List<LearningPathDayDetailDto> savedDayDetailsDtos = savedMasterPath.getDayEntries().stream()
//                .map(dayEntry -> modelMapper.map(dayEntry, LearningPathDayDetailDto.class))
//                .collect(Collectors.toList());
//        responseDto.setDayDetails(savedDayDetailsDtos);
//
//        return Response.builder()
//                .status(HttpStatus.OK.value()) // Use OK for successful update
//                .message("Learning path with ID '" + learningPathId + "' updated successfully.")
//                .learningPath(responseDto)
//                .build();
//    }

    @Transactional
    public Response updateLearningPathById(Long learningPathId, LearningPathBatchRequestDto requestDto) {
        LearningPath masterLearningPath = learningPathRepository.findById(learningPathId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning path not found"));

        ServiceLine serviceLine = serviceLineRepository.findByTrackName(requestDto.getServiceLineName())
                .orElseThrow(() -> new ResourceNotFoundException("Service line not found"));

        masterLearningPath.setServiceLine(serviceLine);
        masterLearningPath.setDurationWeeks(requestDto.getTotalDurationWeeks());

        // ✅ Clear existing day entries properly without replacing the collection
        masterLearningPath.clearDayEntries();

        // ✅ Add new day entries
        for (LearningPathDayDetailDto dayDetailDto : requestDto.getDayDetails()) {
            LearningPathDayEntry dayEntry = new LearningPathDayEntry();
            dayEntry.setDayNumber(dayDetailDto.getDayNumber());
            dayEntry.setTopic(dayDetailDto.getTopic());
            dayEntry.setDescription(dayDetailDto.getDescription());
            masterLearningPath.addDayEntry(dayEntry); // ✅ Maintains bidirectional association
        }

        // ✅ Save the entity after modifications
        learningPathRepository.save(masterLearningPath);

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Learning path updated successfully")
                .build();
    }



    public Response getLearningPathByLearningPathId(Long learningPathId) {
        // 1. Check if the LearningPath with the given ID is available
        Optional<LearningPath> learningPathOptional = learningPathRepository.findById(learningPathId);

        if (learningPathOptional.isEmpty()) {
            // If LearningPath is not found, return NOT_FOUND response
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Learning Path with ID '" + learningPathId + "' not found.")
                    .build();
        }

        LearningPath learningPath = learningPathOptional.get();

        // 2. Fetch all details of the learningPath from the LearningPathDayEntry table
        // This assumes LearningPathDayEntry has a foreign key to LearningPath
        // and your repository has a method to find by the associated LearningPath entity.
        // If dayEntries are eagerly fetched (e.g., @OneToMany(fetch = FetchType.EAGER)),
        // you might not need a separate repository call here.
        List<LearningPathDayEntry> dayEntries = learningPathDayEntryRepository.findByLearningPath_LearningPathId(learningPathId);

        // 3. Map entities to DTOs
        LearningPathDto responseDto = modelMapper.map(learningPath, LearningPathDto.class);

        // Ensure serviceLineName is correctly set if it's part of a nested object
        // (e.g., if LearningPath has a ServiceLine object)
        if (learningPath.getServiceLine() != null) {
            responseDto.setServiceLineName(learningPath.getServiceLine().getTrackName());
        }

        // Map the list of day entries to a list of LearningPathDayDetailDto
        List<LearningPathDayDetailDto> dayDetailDtos = dayEntries.stream()
                .map(dayEntry -> modelMapper.map(dayEntry, LearningPathDayDetailDto.class))
                .collect(Collectors.toList());

        responseDto.setDayDetails(dayDetailDtos);

        // 4. Build and return the successful Response
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Learning Path with ID '" + learningPathId + "' retrieved successfully.")
                .learningPath(responseDto) // Attach the mapped DTO to the response
                .build();
    }
 
    @Override
    public Response getLearningPathByServiceLineName(String serviceLineName) {
        Optional<ServiceLine> serviceLineOptional = serviceLineRepository.findByTrackName(serviceLineName);
        if (serviceLineOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Service Line with name '" + serviceLineName + "' not found.")
                    .build();
        }
        ServiceLine serviceLine = serviceLineOptional.get();
 
        Optional<LearningPath> masterLearningPathOptional = learningPathRepository.findByServiceLine(serviceLine);
        if (masterLearningPathOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No learning path found for Service Line '" + serviceLineName + "'.")
                    .build();
        }
        LearningPath masterLearningPath = masterLearningPathOptional.get();
 
        // Load day entries (if not eagerly fetched)
        List<LearningPathDayEntry> dayEntries = masterLearningPath.getDayEntries();
 
        LearningPathDto responseDto = modelMapper.map(masterLearningPath, LearningPathDto.class);
        responseDto.setServiceLineName(masterLearningPath.getServiceLine().getTrackName());
        responseDto.setDayDetails(dayEntries.stream()
                .map(dayEntry -> modelMapper.map(dayEntry, LearningPathDayDetailDto.class))
                .collect(Collectors.toList()));
 
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Learning path retrieved successfully for Service Line '" + serviceLineName + "'.")
                .learningPath(responseDto)
                .build();
    }
 
    @Override
 
    public Response updateLearningPathDay(Long dayEntryId, LearningPathDayDetailDto dayDetailDto) {
        Optional<LearningPathDayEntry> existingDayEntryOptional = learningPathDayEntryRepository.findById(dayEntryId);
        if (existingDayEntryOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Learning Path Day Entry with ID " + dayEntryId + " not found.")
                    .build();
        }
 
        LearningPathDayEntry existingDayEntry = existingDayEntryOptional.get();
 
        // Update fields for the specific day entry
        if (dayDetailDto.getTopic() != null) {
            existingDayEntry.setTopic(dayDetailDto.getTopic());
        }
        if (dayDetailDto.getDescription() != null) {
            existingDayEntry.setDescription(dayDetailDto.getDescription());
        }
       
 
        LearningPathDayEntry updatedDayEntry = learningPathDayEntryRepository.save(existingDayEntry);
 
        // Prepare response DTO for the updated day entry
        LearningPathDayDetailDto updatedDayDto = modelMapper.map(updatedDayEntry, LearningPathDayDetailDto.class);
 
       
        LearningPathDto parentLearningPathDto = modelMapper.map(updatedDayEntry.getLearningPath(), LearningPathDto.class);
        parentLearningPathDto.setServiceLineName(updatedDayEntry.getLearningPath().getServiceLine().getTrackName());
        parentLearningPathDto.setDayDetails(
            updatedDayEntry.getLearningPath().getDayEntries().stream()
                .map(entry -> modelMapper.map(entry, LearningPathDayDetailDto.class))
                .collect(Collectors.toList())
        );
 
 
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Learning Path Day Entry updated successfully for ID " + dayEntryId + ".")
                .learningPath(parentLearningPathDto) // Returning the full parent path for context
                .build();
    }
 
 
    @Override
 
    public Response deleteLearningPathByServiceLine(String serviceLineName) {
        Optional<ServiceLine> serviceLineOptional = serviceLineRepository.findByTrackName(serviceLineName);
        if (serviceLineOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Service Line with name '" + serviceLineName + "' not found.")
                    .build();
        }
        ServiceLine serviceLine = serviceLineOptional.get();
 
        Optional<LearningPath> masterLearningPathOptional = learningPathRepository.findByServiceLine(serviceLine);
        if (masterLearningPathOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No learning path found to delete for Service Line '" + serviceLineName + "'.")
                    .build();
        }
 
        LearningPath masterLearningPath = masterLearningPathOptional.get();
        
        learningPathRepository.delete(masterLearningPath);
 
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Learning path and all its day entries deleted successfully for Service Line '" + serviceLineName + "'.")
                .build();
    }
    
    @Override
    public Response getAllLearningPathsBasicInfo() {
        List<LearningPath> learningPaths = learningPathRepository.findAll(); // Fetches all LearningPath entities
 
        if (learningPaths.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No learning paths found in the system.")
                    .build();
        }
 
        // Map LearningPath entities to LearningPathDto.
        // ModelMapper will map learningPathId, durationWeeks.
        // serviceLineName needs to be manually set or mapped with configuration.
        // dayDetails will be null because we don't access the lazy-loaded collection here.
        List<LearningPathDto> learningPathDtos = learningPaths.stream()
            .map(path -> {
                LearningPathDto dto = modelMapper.map(path, LearningPathDto.class);
                // Manually set serviceLineName as it's not a direct property of LearningPath
                dto.setServiceLineName(path.getServiceLine().getTrackName());
                // dayDetails will be null by default, and @JsonInclude(JsonInclude.Include.NON_NULL) will exclude it
                return dto;
            })
            .collect(Collectors.toList());
 
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("All learning paths (basic info) retrieved successfully.")
                .learningPaths(learningPathDtos) // Use the new field for the list
                .build();
    }
}