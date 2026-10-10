package com.saran.TraineeManagementSystem.services.serviceImpl;

import com.saran.TraineeManagementSystem.Dtos.*;
import com.saran.TraineeManagementSystem.Exceptions.ResourceNotFoundException;
import com.saran.TraineeManagementSystem.models.*;
import com.saran.TraineeManagementSystem.Repositories.*;
import com.saran.TraineeManagementSystem.services.CohortService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper; // Still needed for DTO to Entity mapping if you keep that
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CohortServiceImpl implements CohortService {

    private final CohortRepository cohortRepository;
    private final DomainRepository domainRepository;
    private final ServiceLineRepository serviceLineRepository;
    private final TechTrainerRepository technicalTrainerRepository;
    private final CoachRepository coachRepository;
    private final BHTrainerRepository bhTrainerRepository;
    private final MentorRepository mentorRepository;
    private final LocationRepository locationRepository;
    private final HireTypeRepository hireTypeRepository;
    private final VerticalRepository verticalRepository;
    private final LearningPathRepository learningPathRepository;
    private final ModelMapper modelMapper; // Retaining for DTO to Entity mapping (cohortDto -> cohort entity)

	    public CohortServiceImpl(CohortRepository cohortRepository, DomainRepository domainRepository,
	            ServiceLineRepository serviceLineRepository, TechTrainerRepository technicalTrainerRepository,
	            CoachRepository coachRepository, BHTrainerRepository bhTrainerRepository,
	            MentorRepository mentorRepository, LocationRepository locationRepository,
	            HireTypeRepository hireTypeRepository, VerticalRepository verticalRepository, LearningPathRepository learningPathRepository,
	            ModelMapper modelMapper) {
		this.cohortRepository = cohortRepository;
		this.domainRepository = domainRepository;
		this.serviceLineRepository = serviceLineRepository;
		this.technicalTrainerRepository = technicalTrainerRepository;
		this.coachRepository = coachRepository;
		this.bhTrainerRepository = bhTrainerRepository;
		this.mentorRepository = mentorRepository;
		this.locationRepository = locationRepository;
		this.hireTypeRepository = hireTypeRepository;
		this.verticalRepository = verticalRepository;
		this.learningPathRepository = learningPathRepository;
		this.modelMapper = modelMapper;
	}
    private CohortDto convertCohortToDto(Cohort cohort) {
        CohortDto dto = new CohortDto(); // Manually instantiate
        dto.setCohortId(cohort.getCohortId());
        dto.setCohortCode(cohort.getCohortCode());

        // Manually set all related entity names in DTO with null checks
        if (cohort.getDomain() != null) dto.setDomainName(cohort.getDomain().getDomainName());
        if (cohort.getServiceLine() != null) dto.setServiceLine(cohort.getServiceLine().getTrackName());
        if(cohort.getTechnicalTrainer() != null) {
            TechnicalTrainer technicalTrainer = cohort.getTechnicalTrainer();
            TechnicalTrainerDto technicalTrainerDto = new TechnicalTrainerDto();

            technicalTrainerDto.setTechnialTrainerId(technicalTrainer.getTechnialTrainerId());
            technicalTrainerDto.setDescription(technicalTrainer.getDescription());
            technicalTrainerDto.setStatus(technicalTrainer.getStatus());
            technicalTrainerDto.setTechTrainerEmail(technicalTrainer.getTechTrainerEmail());
            technicalTrainerDto.setTechTrainerName(technicalTrainer.getTechTrainerName());
            technicalTrainerDto.setTechTrainerAssociateId(technicalTrainer.getTechTrainerAssociateId());

            dto.setTechnicalTrainer(technicalTrainerDto);
        }

        if (cohort.getCoach() != null) {
            Coach coach = cohort.getCoach();
            CoachDto coachDto = new CoachDto();

            coachDto.setCoachId(coach.getCoachId());
            coachDto.setCoachName(coach.getCoachName());
            coachDto.setCoachEmail(coach.getCoachEmail());
            coachDto.setCoachAssociateId(coach.getCoachAssociateId());

            dto.setCoach(coachDto);
        }

        if (cohort.getBhTrainer() != null) {
            BHTrainer bhTrainer = cohort.getBhTrainer();
            BhTrainerDto bhTrainerDto = new BhTrainerDto();

            bhTrainerDto.setBhTrainerId(bhTrainer.getBhTrainerId());
            bhTrainerDto.setBhTrainerName(bhTrainer.getBhTrainerName());
            bhTrainerDto.setBhTrainerEmail(bhTrainer.getBhTrainerEmail());
            bhTrainerDto.setBhTrainerAssociateId(bhTrainer.getBhTrainerAssociateId());


            dto.setBhTrainer(bhTrainerDto);
        }

        if (cohort.getMentor() != null) {
            Mentor mentor = cohort.getMentor();
            MentorDto mentorDto = new MentorDto();

            mentorDto.setMentorId(mentor.getMentorId());
            mentorDto.setMentorName(mentor.getMentorName());
            mentorDto.setMentorEmail(mentor.getMentorEmail());
            mentorDto.setMentorAssociateId(mentor.getMentorAssociateId());


            dto.setMentor(mentorDto);
        }


        if (cohort.getLocation() != null) dto.setLocation(cohort.getLocation().getLocation());
        if (cohort.getHireType() != null) dto.setHireType(cohort.getHireType().getHireType());
        if (cohort.getVertical() != null) dto.setVertical(cohort.getVertical().getVerticalName());
        if (cohort.getLearningPath() != null) dto.setLearningPathId(cohort.getLearningPath().getLearningPathId());

        // Convert dates back to String for DTO
        if (cohort.getDateOfJoining() != null) dto.setDateOfJoining(cohort.getDateOfJoining().toString());
        if (cohort.getTrainingStartDate() != null) dto.setTrainingStartDate(cohort.getTrainingStartDate().toString());
        if (cohort.getTrainingEndDate() != null) dto.setTrainingEndDate(cohort.getTrainingEndDate().toString());
        return dto;
    }


    @Override
    @Transactional
    public Response addCohort(CohortDto cohortDto) {
        // Check for duplicate Cohort Code
        if (cohortRepository.findByCohortCode(cohortDto.getCohortCode()).isPresent()) {
            return Response.builder().status(HttpStatus.CONFLICT.value())
                    .message("Cohort with code '" + cohortDto.getCohortCode() + "' already exists.").build();
        }

        // Fetch and validate Domain
        Optional<Domain> domainOptional = domainRepository.findByDomainName(cohortDto.getDomainName());
        if(domainOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Domain with name '" + cohortDto.getDomainName() + "' does not exist.")
                    .build();
        }
        Domain domain = domainOptional.get();

        // Fetch and validate ServiceLine
        Optional<ServiceLine> serviceLineOptional = serviceLineRepository.findByTrackName(cohortDto.getServiceLine());
        if(serviceLineOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Service Line with name '" + cohortDto.getServiceLine() + "' does not exist.")
                    .build();
        }
        ServiceLine serviceLine = serviceLineOptional.get();

        // Fetch and validate TechnicalTrainer
        Optional<TechnicalTrainer> technicalTrainerOptional = technicalTrainerRepository.findByTechTrainerName(cohortDto.getTechnicalTrainer().getTechTrainerName());
        if(technicalTrainerOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Technical Trainer with name '" + cohortDto.getTechnicalTrainer().getTechTrainerName() + "' does not exist.")
                    .build();
        }
        TechnicalTrainer technicalTrainer = technicalTrainerOptional.get();

        // Fetch and validate Coach
        Optional<Coach> coachOptional = coachRepository.findByCoachName(cohortDto.getCoach().getCoachName());
        if(coachOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Coach with name '" + cohortDto.getCoach().getCoachName() + "' does not exist.")
                    .build();
        }
        Coach coach = coachOptional.get();

        // Fetch and validate BHTrainer
        Optional<BHTrainer> bhTrainerOptional = bhTrainerRepository.findByBhTrainerName(cohortDto.getBhTrainer().getBhTrainerName());
        if(bhTrainerOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("BH Trainer with name '" + cohortDto.getBhTrainer().getBhTrainerName() + "' does not exist.")
                    .build();
        }
        BHTrainer bhTrainer = bhTrainerOptional.get();

        // Fetch and validate Mentor
        Optional<Mentor> mentorOptional = mentorRepository.findByMentorName(cohortDto.getMentor().getMentorName());
        if(mentorOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Mentor with name '" + cohortDto.getMentor().getMentorName() + "' does not exist.")
                    .build();
        }
        Mentor mentor = mentorOptional.get();

        // Fetch and validate Location
        Optional<Location> locationOptional = locationRepository.findByLocation(cohortDto.getLocation());
        if(locationOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Location with name '" + cohortDto.getLocation() + "' does not exist.")
                    .build();
        }
        Location location = locationOptional.get();

        // Fetch and validate HireType
        Optional<HireType> hireTypeOptional = hireTypeRepository.findByHireType(cohortDto.getHireType());
        if(hireTypeOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Hire Type '" + cohortDto.getHireType() + "' does not exist.")
                    .build();
        }
        HireType hireType = hireTypeOptional.get();

        // Fetch and validate Vertical
        Optional<Vertical> verticalOptional = verticalRepository.findByVerticalName(cohortDto.getVertical());
        if(verticalOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Vertical with name '" + cohortDto.getVertical() + "' does not exist.")
                    .build();
        }
        Vertical vertical = verticalOptional.get();
        
        //Fetch and validate Learning Path
        Optional<LearningPath> learningPathOptional = learningPathRepository.findById(cohortDto.getLearningPathId());
        if(learningPathOptional.isEmpty()) {
        	return Response.builder()
        			.status(HttpStatus.NOT_FOUND.value())
        			.message("Learning Path with Id " + cohortDto.getLearningPathId() + "' does not exist")
        			.build();
        }
        LearningPath learningPath = learningPathOptional.get();

        // Map DTO to Entity (still using ModelMapper for this direction as requested)
        Cohort cohort = modelMapper.map(cohortDto, Cohort.class);

        cohort.setDomain(domain);
        cohort.setServiceLine(serviceLine);
        cohort.setTechnicalTrainer(technicalTrainer);
        cohort.setCoach(coach);
        cohort.setBhTrainer(bhTrainer);
        cohort.setMentor(mentor);
        cohort.setLocation(location);
        cohort.setHireType(hireType);
        cohort.setVertical(vertical);
        cohort.setLearningPath(learningPath);

        // Handle Date conversions from String to java.sql.Date
        try {
            cohort.setDateOfJoining(Date.valueOf(cohortDto.getDateOfJoining()));
            cohort.setTrainingStartDate(Date.valueOf(cohortDto.getTrainingStartDate()));
            cohort.setTrainingEndDate(Date.valueOf(cohortDto.getTrainingEndDate()));
        } catch (IllegalArgumentException e) {
            return Response.builder().status(HttpStatus.BAD_REQUEST.value())
                    .message("Invalid date format. Dates must be in YYYY-MM-DD format.").build();
        }

        Cohort savedCohort = cohortRepository.save(cohort);

        // Use the helper method for Entity to DTO conversion
        CohortDto savedCohortDto = convertCohortToDto(savedCohort);

        return Response.builder()
                .status(HttpStatus.CREATED.value())
                .message("Cohort added successfully.")
                .cohort(savedCohortDto)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Response getAllCohorts() {
        List<Cohort> cohorts = cohortRepository.findAll();
        if (cohorts.isEmpty()) {
            return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("No cohorts found.").build();
        }
        // Use the helper method for each cohort in the list
        List<CohortDto> cohortDtos = cohorts.stream()
                                            .map(this::convertCohortToDto)
                                            .collect(Collectors.toList());

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("All cohorts retrieved successfully.")
                .cohortList(cohortDtos)
                .build();
    }
    
    @Override
    @Transactional
    public Response getCohortsByRole(RegisterAssociateDto associate) {
        List<Cohort> cohorts = Collections.emptyList();
        String message = "No cohorts found for the given role or invalid role.";

        switch (associate.getRole()) {
            case ADMIN:
            case SKILLING_LEAD:
            case ACADEMY_COORDINATOR:
            case GUEST:
                // For roles like ADMIN, SKILLING_LEAD, ACADEMY_COORDINATOR, GUEST, CR
                // it's possible they can see all cohorts, or all cohorts visible
                // within their scope. For simplicity, let's assume they can see all.
                // GUEST users have read-only access to all cohorts (same view as ADMIN)
                // If there's a specific scope (e.g., location, domain), you'd
                // need to add filters here based on additional properties in RegisterAssociateDto.
                cohorts = cohortRepository.findAll();
                message = "All cohorts retrieved.";
                break;

            case TECHNICAL_TRAINER:
                if (associate.getAssociateEmail() == null || associate.getAssociateEmail().isEmpty()) {
                    return Response.builder().status(HttpStatus.BAD_REQUEST.value()).message("Technical Trainer Associate Email is required.").build();
                }
                Optional<TechnicalTrainer> techTrainerOptional = technicalTrainerRepository.findByTechTrainerEmail(associate.getAssociateEmail());
                if (techTrainerOptional.isPresent()) {
                    cohorts = cohortRepository.findByTechnicalTrainer(techTrainerOptional.get());
                    message = "Cohorts retrieved for technical trainer with Email: " + associate.getAssociateEmail();
                } else {
                    return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("Technical Trainer with Email " + associate.getAssociateEmail() + " not found.").build();
                }
                break;

            case COACH:
                if (associate.getAssociateEmail() == null || associate.getAssociateEmail().isEmpty()) {
                    return Response.builder().status(HttpStatus.BAD_REQUEST.value()).message("Coach Associate Email is required.").build();
                }
                Optional<Coach> coachOptional = coachRepository.findByCoachEmail(associate.getAssociateEmail()); // Assuming a findByCoachAssociateId method
                if (coachOptional.isPresent()) {
                    cohorts = cohortRepository.findByCoach(coachOptional.get()); // Assuming a findByCoach method in CohortRepository
                    message = "Cohorts retrieved for coach with Email: " + associate.getAssociateEmail();
                } else {
                    return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("Coach with Email " + associate.getAssociateEmail() + " not found.").build();
                }
                break;

            case BH_TRAINER:
                if (associate.getAssociateEmail() == null || associate.getAssociateEmail().isEmpty()) {
                    return Response.builder().status(HttpStatus.BAD_REQUEST.value()).message("BH Trainer Associate Email is required.").build();
                }
                Optional<BHTrainer> bhTrainerOptional = bhTrainerRepository.findByBhTrainerEmail(associate.getAssociateEmail()); // Assuming a findByBhTrainerAssociateId method
                if (bhTrainerOptional.isPresent()) {
                    cohorts = cohortRepository.findByBhTrainer(bhTrainerOptional.get()); // Assuming a findByBhTrainer method in CohortRepository
                    message = "Cohorts retrieved for BH Trainer with Email: " + associate.getAssociateEmail();
                } else {
                    return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("BH Trainer with Email " + associate.getAssociateEmail() + " not found.").build();
                }
                break;

            case MENTOR:
                if (associate.getAssociateEmail() == null || associate.getAssociateEmail().isEmpty()) {
                    return Response.builder().status(HttpStatus.BAD_REQUEST.value()).message("Mentor Associate Email is required.").build();
                }
                Optional<Mentor> mentorOptional = mentorRepository.findByMentorEmail(associate.getAssociateEmail()); // Assuming a findByMentorAssociateId method
                if (mentorOptional.isPresent()) {
                    cohorts = cohortRepository.findByMentor(mentorOptional.get()); // Assuming a findByMentor method in CohortRepository
                    message = "Cohorts retrieved for Mentor with Email: " + associate.getAssociateEmail();
                } else {
                    return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("Mentor with Email " + associate.getAssociateEmail() + " not found.").build();
                }
                break;

//            case DOMAIN_LEAD:
//                // Assuming RegisterAssociateDto contains a domain ID or name
//                if (associate.getDomainId() == null && associate.getDomainName() == null) {
//                    return Response.builder().status(HttpStatus.BAD_REQUEST.value()).message("Domain ID or Name is required for Domain Lead.").build();
//                }
//                Optional<Domain> domainOptional;
//                if (associate.getDomainId() != null) {
//                    domainOptional = domainRepository.findById(associate.getDomainId());
//                } else {
//                    domainOptional = domainRepository.findByDomainName(associate.getDomainName()); // Assuming findByDomainName
//                }
//
//                if (domainOptional.isPresent()) {
//                    cohorts = cohortRepository.findByDomain(domainOptional.get()); // Assuming findByDomain in CohortRepository
//                    message = "Cohorts retrieved for Domain Lead in domain: " + domainOptional.get().getDomainName();
//                } else {
//                    return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("Domain not found for Domain Lead.").build();
//                }
//                break;

            // Add more cases for other roles if they have a direct relationship with Cohorts
            // For example, if a cohort is associated with a specific location, learning path, service line, or vertical.
            // You'd need to add corresponding fields to RegisterAssociateDto and logic here.

            default:
                return Response.builder().status(HttpStatus.BAD_REQUEST.value()).message("Unsupported user role for cohort retrieval.").build();
        }

        if (cohorts.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No cohorts found for the specified criteria.")
                    .build();
        }

        List<CohortDto> cohortDtoList = cohorts.stream()
                .map(this::convertCohortToDto)
                .collect(Collectors.toList());

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message(message)
                .cohortList(cohortDtoList)
                .build();
    }
    
    //get cohorts list based on the trainer id
    @Override
    @Transactional
    public Response getCohortsByTechnicalTrainerAssociateId(String trainerAssociateId) {
    	Optional<TechnicalTrainer> tech_trainer_optional = technicalTrainerRepository.findByTechTrainerAssociateId(trainerAssociateId);
    	if(tech_trainer_optional.isEmpty()) {
    		return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("Trainer with ID " + trainerAssociateId + "not found.").build();
    	}
    	TechnicalTrainer tech_trainer = tech_trainer_optional.get();
    	List<Cohort> cohorts = cohortRepository.findByTechnicalTrainer(tech_trainer);
    	
    	List<CohortDto> cohortDtoList = cohorts.stream()
    										.map(this :: convertCohortToDto)
    										.collect(Collectors.toList());
    	
    	return Response.builder()
    			.status(HttpStatus.OK.value())
    			.message("Cohort retreived for the tech trainer with ID")
    			.cohortList(cohortDtoList)
    			.build();
    			
    }
    

    @Override
    @Transactional(readOnly = true)
    public Response getCohortById(Long id) {
        Optional<Cohort> cohortOptional = cohortRepository.findById(id);
        if (cohortOptional.isEmpty()) {
            return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("Cohort with ID " + id + " not found.").build();
        }
        Cohort cohort = cohortOptional.get();
        // Use the helper method
        CohortDto cohortDto = convertCohortToDto(cohort);

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Cohort retrieved successfully by ID.")
                .cohort(cohortDto)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Cohort getCohortByIdTesting(Long id) {
        Optional<Cohort> cohortOptional = cohortRepository.findById(id);
//        if (cohortOptional.isEmpty()) {
//            return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("Cohort with ID " + id + " not found.").build();
//        }
        if(cohortOptional.isEmpty()) {
            System.out.println("cohort doesnot exist");
        }
        Cohort cohort = cohortOptional.get();

        // Use the helper method
        return cohort;
    }



    @Override
    @Transactional(readOnly = true)
    public Response getCohortByCode(String code) {
        Optional<Cohort> cohortOptional = cohortRepository.findByCohortCode(code);
        if (cohortOptional.isEmpty()) {
            return Response.builder().status(HttpStatus.NOT_FOUND.value()).message("Cohort with code '" + code + "' not found.").build();
        }
        Cohort cohort = cohortOptional.get();
        // Use the helper method
        CohortDto cohortDto = convertCohortToDto(cohort);

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Cohort retrieved successfully by code.")
                .cohort(cohortDto)
                .build();
    }

    @Override
    @Transactional
    public Response updateCohort(Long id, CohortDto cohortDto) {
        Optional<Cohort> existingCohortOptional = cohortRepository.findById(id);
        if (existingCohortOptional.isEmpty()) {
            return Response.builder().status(HttpStatus.NOT_FOUND.value())
                    .message("Cohort with ID " + id + " not found for update.").build();
        }
        Cohort existingCohort = existingCohortOptional.get();

        // Fetch and validate all referenced entities for update
        Optional<Domain> domainOptional = domainRepository.findByDomainName(cohortDto.getDomainName());
        if(domainOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Domain with name '" + cohortDto.getDomainName() + "' does not exist.")
                    .build();
        }
        Domain domain = domainOptional.get();

        Optional<ServiceLine> serviceLineOptional = serviceLineRepository.findByTrackName(cohortDto.getServiceLine());
        if(serviceLineOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Service Line with name '" + cohortDto.getServiceLine() + "' does not exist.")
                    .build();
        }
        ServiceLine serviceLine = serviceLineOptional.get();

        Optional<TechnicalTrainer> technicalTrainerOptional = technicalTrainerRepository.findByTechTrainerName(cohortDto.getTechnicalTrainer().getTechTrainerName());
        if(technicalTrainerOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Technical Trainer with name '" + cohortDto.getTechnicalTrainer().getTechTrainerName() + "' does not exist.")
                    .build();
        }
        TechnicalTrainer technicalTrainer = technicalTrainerOptional.get();

        Optional<Coach> coachOptional = coachRepository.findByCoachName(cohortDto.getCoach().getCoachName());
        if(coachOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Coach with name '" + cohortDto.getCoach().getCoachName() + "' does not exist.")
                    .build();
        }
        Coach coach = coachOptional.get();

        Optional<BHTrainer> bhTrainerOptional = bhTrainerRepository.findByBhTrainerName(cohortDto.getBhTrainer().getBhTrainerName());
        if(bhTrainerOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("BH Trainer with name '" + cohortDto.getBhTrainer().getBhTrainerName() + "' does not exist.")
                    .build();
        }
        BHTrainer bhTrainer = bhTrainerOptional.get();

        Optional<Mentor> mentorOptional = mentorRepository.findByMentorName(cohortDto.getMentor().getMentorName());
        if(mentorOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Mentor with name '" + cohortDto.getMentor().getMentorName() + "' does not exist.")
                    .build();
        }
        Mentor mentor = mentorOptional.get();

        Optional<Location> locationOptional = locationRepository.findByLocation(cohortDto.getLocation());
        if(locationOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Location with name '" + cohortDto.getLocation() + "' does not exist.")
                    .build();
        }
        Location location = locationOptional.get();

        Optional<HireType> hireTypeOptional = hireTypeRepository.findByHireType(cohortDto.getHireType());
        if(hireTypeOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Hire Type '" + cohortDto.getHireType() + "' does not exist.")
                    .build();
        }
        HireType hireType = hireTypeOptional.get();

        Optional<Vertical> verticalOptional = verticalRepository.findByVerticalName(cohortDto.getVertical());
        if(verticalOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Vertical with name '" + cohortDto.getVertical() + "' does not exist.")
                    .build();
        }
        Vertical vertical = verticalOptional.get();

        // Check for duplicate Cohort Code if being changed
        if (!existingCohort.getCohortCode().equals(cohortDto.getCohortCode())) {
            if (cohortRepository.findByCohortCode(cohortDto.getCohortCode()).isPresent()) {
                return Response.builder().status(HttpStatus.CONFLICT.value())
                        .message("Cohort with code '" + cohortDto.getCohortCode() + "' already exists.").build();
            }
        }

        // Map DTO to existing entity for direct field updates (still using ModelMapper for this direction)
        modelMapper.map(cohortDto, existingCohort);

        // Reset relationships with the newly fetched, persistent entities
        existingCohort.setDomain(domain);
        existingCohort.setServiceLine(serviceLine);
        existingCohort.setTechnicalTrainer(technicalTrainer);
        existingCohort.setCoach(coach);
        existingCohort.setBhTrainer(bhTrainer);
        existingCohort.setMentor(mentor);
        existingCohort.setLocation(location);
        existingCohort.setHireType(hireType);
        existingCohort.setVertical(vertical);
        existingCohort.setCohortId(id); // Ensure the ID from the path is retained

        // Handle Date conversions
        try {
            existingCohort.setDateOfJoining(Date.valueOf(cohortDto.getDateOfJoining()));
            existingCohort.setTrainingStartDate(Date.valueOf(cohortDto.getTrainingStartDate()));
            existingCohort.setTrainingEndDate(Date.valueOf(cohortDto.getTrainingEndDate()));
        } catch (IllegalArgumentException e) {
            return Response.builder().status(HttpStatus.BAD_REQUEST.value())
                    .message("Invalid date format. Dates must be in YYYY-MM-DD format.").build();
        }

        Cohort updatedCohort = cohortRepository.save(existingCohort);

        // Use the helper method to convert the updated entity to DTO
        CohortDto updatedCohortDto = convertCohortToDto(updatedCohort);

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Cohort updated successfully.")
                .cohort(updatedCohortDto)
                .build();
    }

    @Override
    @Transactional
    public Response deleteCohort(Long id) {
        if (!cohortRepository.existsById(id)) {
            return Response.builder().status(HttpStatus.NOT_FOUND.value())
                    .message("Cohort with ID " + id + " not found for deletion.").build();
        }
        cohortRepository.deleteById(id);
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Cohort deleted successfully.")
                .build();
    }
    
    @Override
    @Transactional
    public Response updateCohortStaff(Long cohortId, com.saran.TraineeManagementSystem.Dtos.CohortStaffUpdateDto staffDto) {
        Optional<Cohort> cohortOpt = cohortRepository.findById(cohortId);
        if (cohortOpt.isEmpty()) {
            return Response.builder().status(HttpStatus.NOT_FOUND.value())
                    .message("Cohort with ID " + cohortId + " not found.").build();
        }
        Cohort cohort = cohortOpt.get();

        // Technical Trainer
        if (staffDto.getTechTrainerAssociateId() != null && !staffDto.getTechTrainerAssociateId().isBlank()) {
            Optional<TechnicalTrainer> tt = technicalTrainerRepository.findByTechTrainerAssociateId(staffDto.getTechTrainerAssociateId());
            if (tt.isEmpty()) {
                return Response.builder().status(HttpStatus.NOT_FOUND.value())
                        .message("Technical Trainer with associateId '" + staffDto.getTechTrainerAssociateId() + "' not found.").build();
            }
            cohort.setTechnicalTrainer(tt.get());
        }

        // Coach
        if (staffDto.getCoachAssociateId() != null && !staffDto.getCoachAssociateId().isBlank()) {
            Optional<Coach> coach = coachRepository.findByCoachAssociateId(staffDto.getCoachAssociateId());
            if (coach.isEmpty()) {
                return Response.builder().status(HttpStatus.NOT_FOUND.value())
                        .message("Coach with associateId '" + staffDto.getCoachAssociateId() + "' not found.").build();
            }
            cohort.setCoach(coach.get());
        }

        // Mentor
        if (staffDto.getMentorAssociateId() != null && !staffDto.getMentorAssociateId().isBlank()) {
            Optional<Mentor> mentor = mentorRepository.findByMentorAssociateId(staffDto.getMentorAssociateId());
            if (mentor.isEmpty()) {
                return Response.builder().status(HttpStatus.NOT_FOUND.value())
                        .message("Mentor with associateId '" + staffDto.getMentorAssociateId() + "' not found.").build();
            }
            cohort.setMentor(mentor.get());
        }

        // BH Trainer
        if (staffDto.getBhTrainerAssociateId() != null && !staffDto.getBhTrainerAssociateId().isBlank()) {
            Optional<BHTrainer> bh = bhTrainerRepository.findByBhTrainerAssociateId(staffDto.getBhTrainerAssociateId());
            if (bh.isEmpty()) {
                return Response.builder().status(HttpStatus.NOT_FOUND.value())
                        .message("BH Trainer with associateId '" + staffDto.getBhTrainerAssociateId() + "' not found.").build();
            }
            cohort.setBhTrainer(bh.get());
        }

        Cohort saved = cohortRepository.save(cohort);
        CohortDto dto = convertCohortToDto(saved);
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Cohort staff updated successfully.")
                .cohort(dto)
                .build();
    }
    
    
}