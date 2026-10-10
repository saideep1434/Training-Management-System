package com.saran.TraineeManagementSystem.Dtos;
 
import java.util.List;
 
import com.fasterxml.jackson.annotation.JsonInclude;
 
@JsonInclude(JsonInclude.Include.NON_NULL)

public class Response {
 
    private int status;
    private String message;

    private CoachDto coach;
    private List<CoachDto> coachs;

    private MentorDto mentor;
    private List<MentorDto> mentorList;

    private TechnicalTrainerDto technicalTrainer;
    private List<TechnicalTrainerDto> technicalTrainerList;

    private BhTrainerDto bhTrainer;
    private List<BhTrainerDto> bhTrainerList;

    private DomainDto domainName;
    private List<DomainDto> domainNameList;

    private ServiceLineDto serviceLine;
    private List<ServiceLineDto> serviceLines;

    private CohortDto cohort;
    private List<CohortDto> cohortList;

    private TraineeDto trainee;
    private List<TraineeDto> traineeList;

    private LocationDto location;
    private List<LocationDto> locationList;

    private HireTypeDto hireType;
    private List<HireTypeDto> hireTypeList;

    private VerticalDto vertical;
    private List<VerticalDto> verticalList;

    private LearningPathDto learningPath;
    private List<LearningPathDto> learningPaths;

    private RegisterAssociateDto registeredAssociate;
    private List<RegisterAssociateDto> registeredAssociates;

    private EventDTO event;
    private List<EventDTO> events;
    // Bulk operations result (optional)
    private List<BulkRowResultDto> bulkResults;
 
    // --- Constructors ---
 
    // No-argument constructor

    public Response() {

    }
 
    // All-argument constructor

    // This constructor needs to include ALL fields, including learningPath

    public Response(int status, String message,
                    CoachDto coach, List<CoachDto> coachs,
                    MentorDto mentor, List<MentorDto> mentorList,
                    TechnicalTrainerDto technicalTrainer, List<TechnicalTrainerDto> technicalTrainerList,
                    BhTrainerDto bhTrainer, List<BhTrainerDto> bhTrainerList,
                    DomainDto domainName, List<DomainDto> domainNameList,
                    ServiceLineDto serviceLine, List<ServiceLineDto> serviceLines,
                    CohortDto cohort, List<CohortDto> cohortList,
                    TraineeDto trainee, List<TraineeDto> traineeList,
                    LocationDto location, List<LocationDto> locationList,
                    HireTypeDto hireType, List<HireTypeDto> hireTypeList,
                    VerticalDto vertical, List<VerticalDto> verticalList,
                    LearningPathDto learningPath, List<LearningPathDto> learningPaths,
                    RegisterAssociateDto registeredAssociate, List<RegisterAssociateDto> registeredAssociates,
                    EventDTO event, List<EventDTO> events,
                    List<BulkRowResultDto> bulkResults) {

        this.status = status;
        this.message = message;
        this.coach = coach;
        this.coachs = coachs;
        this.mentor = mentor;
        this.mentorList = mentorList;
        this.technicalTrainer = technicalTrainer;
        this.technicalTrainerList = technicalTrainerList;
        this.bhTrainer = bhTrainer;
        this.bhTrainerList = bhTrainerList;
        this.domainName = domainName;
        this.domainNameList = domainNameList;
        this.serviceLine = serviceLine;
        this.serviceLines = serviceLines;
        this.cohort = cohort;
        this.cohortList = cohortList;
        this.trainee = trainee;
        this.traineeList = traineeList;
        this.location = location;
        this.locationList = locationList;
        this.hireType = hireType;
        this.hireTypeList = hireTypeList;
        this.vertical = vertical;
        this.verticalList = verticalList;
        this.learningPath = learningPath;
        this.learningPaths = learningPaths;
        this.registeredAssociate = registeredAssociate;
        this.registeredAssociates = registeredAssociates;
        this.event = event;
        this.events = events;
        this.bulkResults = bulkResults;
    }
 
    // --- Getters and Setters ---
 
    public int getStatus() {

        return status;

    }
 
    public void setStatus(int status) {

        this.status = status;

    }
 
    public String getMessage() {

        return message;

    }
 
    public void setMessage(String message) {

        this.message = message;

    }
 
    public CoachDto getCoach() {

        return coach;

    }
 
    public void setCoach(CoachDto coach) {

        this.coach = coach;

    }
 
    public List<CoachDto> getCoachs() {

        return coachs;

    }
 
    public void setCoachs(List<CoachDto> coachs) {

        this.coachs = coachs;

    }
 
    public MentorDto getMentor() {

        return mentor;

    }
 
    public void setMentor(MentorDto mentor) {

        this.mentor = mentor;

    }
 
    public List<MentorDto> getMentorList() {

        return mentorList;

    }
 
    public void setMentorList(List<MentorDto> mentorList) {

        this.mentorList = mentorList;

    }
 
    public TechnicalTrainerDto getTechnicalTrainer() {

        return technicalTrainer;

    }
 
    public void setTechnicalTrainer(TechnicalTrainerDto technicalTrainer) {

        this.technicalTrainer = technicalTrainer;

    }
 
    public List<TechnicalTrainerDto> getTechnicalTrainerList() {

        return technicalTrainerList;

    }
 
    public void setTechnicalTrainerList(List<TechnicalTrainerDto> technicalTrainerList) {

        this.technicalTrainerList = technicalTrainerList;

    }
 
    public BhTrainerDto getBhTrainer() {

        return bhTrainer;

    }
 
    public void setBhTrainer(BhTrainerDto bhTrainer) {

        this.bhTrainer = bhTrainer;

    }
 
    public List<BhTrainerDto> getBhTrainerList() {

        return bhTrainerList;

    }
 
    public void setBhTrainerList(List<BhTrainerDto> bhTrainerList) {

        this.bhTrainerList = bhTrainerList;

    }
 
    public DomainDto getDomainName() {

        return domainName;

    }
 
    public void setDomainName(DomainDto domainName) {

        this.domainName = domainName;

    }
 
    public List<DomainDto> getDomainNameList() {

        return domainNameList;

    }
 
    public void setDomainNameList(List<DomainDto> domainNameList) {

        this.domainNameList = domainNameList;

    }
 
    public ServiceLineDto getServiceLine() {

        return serviceLine;

    }
 
    public void setServiceLine(ServiceLineDto serviceLine) {

        this.serviceLine = serviceLine;

    }
 
    public List<ServiceLineDto> getServiceLines() {

        return serviceLines;

    }
 
    public void setServiceLines(List<ServiceLineDto> serviceLines) {

        this.serviceLines = serviceLines;

    }
 
    public CohortDto getCohort() {

        return cohort;

    }
 
    public void setCohort(CohortDto cohort) {

        this.cohort = cohort;

    }
 
    public List<CohortDto> getCohortList() {

        return cohortList;

    }
 
    public void setCohortList(List<CohortDto> cohortList) {

        this.cohortList = cohortList;

    }
 
    public TraineeDto getTrainee() {

        return trainee;

    }
 
    public void setTrainee(TraineeDto trainee) {

        this.trainee = trainee;

    }
 
    public List<TraineeDto> getTraineeList() {

        return traineeList;

    }
 
    public void setTraineeList(List<TraineeDto> traineeList) {

        this.traineeList = traineeList;

    }
 
    public LocationDto getLocation() {

        return location;

    }
 
    public void setLocation(LocationDto location) {

        this.location = location;

    }
 
    public List<LocationDto> getLocationList() {

        return locationList;

    }
 
    public void setLocationList(List<LocationDto> locationList) {

        this.locationList = locationList;

    }
 
    public HireTypeDto getHireType() {

        return hireType;

    }
 
    public void setHireType(HireTypeDto hireType) {

        this.hireType = hireType;

    }
 
    public List<HireTypeDto> getHireTypeList() {

        return hireTypeList;

    }
 
    public void setHireTypeList(List<HireTypeDto> hireTypeList) {

        this.hireTypeList = hireTypeList;

    }
 
    public VerticalDto getVertical() {

        return vertical;

    }
 
    public void setVertical(VerticalDto vertical) {

        this.vertical = vertical;

    }
 
    public List<VerticalDto> getVerticalList() {

        return verticalList;

    }
 
    public void setVerticalList(List<VerticalDto> verticalList) {

        this.verticalList = verticalList;

    }
 
    public LearningPathDto getLearningPath() { // Getter for LearningPathDto

        return learningPath;

    }
 
    public void setLearningPath(LearningPathDto learningPath) { // Setter for LearningPathDto

        this.learningPath = learningPath;

    }

 
    public List<LearningPathDto> getLearningPaths() {

		return learningPaths;

	}
 
	public void setLearningPaths(List<LearningPathDto> learningPaths) {

		this.learningPaths = learningPaths;

	}
	
	
 
public RegisterAssociateDto getRegisteredAssociate() {
		return registeredAssociate;
	}

	public void setRegisteredAssociate(RegisterAssociateDto registeredAssociate) {
		this.registeredAssociate = registeredAssociate;
	}

	public List<RegisterAssociateDto> getRegisteredAssociates() {
		return registeredAssociates;
	}

	public void setRegisteredAssociates(List<RegisterAssociateDto> registeredAssociates) {
		this.registeredAssociates = registeredAssociates;
	}

    public EventDTO getEvent() { return event; }
    public void setEvent(EventDTO event) { this.event = event; }

    public List<EventDTO> getEvents() { return events; }
    public void setEvents(List<EventDTO> events) { this.events = events; }

    public List<BulkRowResultDto> getBulkResults() { return bulkResults; }
    public void setBulkResults(List<BulkRowResultDto> bulkResults) { this.bulkResults = bulkResults; }

public static ResponseBuilder builder() {

        return new ResponseBuilder();

    }
 
    public static class ResponseBuilder {

        private int status;

        private String message;

        private CoachDto coach;

        private List<CoachDto> coachs;

        private MentorDto mentor;

        private List<MentorDto> mentorList;

        private TechnicalTrainerDto technicalTrainer;

        private List<TechnicalTrainerDto> technicalTrainerList;

        private BhTrainerDto bhTrainer;

        private List<BhTrainerDto> bhTrainerList;

        private DomainDto domainName;

        private List<DomainDto> domainNameList;

        private ServiceLineDto serviceLine;

        private List<ServiceLineDto> serviceLines;

        private CohortDto cohort;

        private List<CohortDto> cohortList;

        private TraineeDto trainee;

        private List<TraineeDto> traineeList;

        private LocationDto location;

        private List<LocationDto> locationList;

        private HireTypeDto hireType;

        private List<HireTypeDto> hireTypeList;

        private VerticalDto vertical;

        private List<VerticalDto> verticalList;

        private LearningPathDto learningPath; 

        private List<LearningPathDto> learningPaths;
        private RegisterAssociateDto registeredAssociate;
        
        private List<RegisterAssociateDto> registeredAssociates;
        private EventDTO event;
        private List<EventDTO> events;
    private List<BulkRowResultDto> bulkResults;
 
        ResponseBuilder() {

        }
 
        public ResponseBuilder status(int status) {

            this.status = status;

            return this;

        }
 
        public ResponseBuilder message(String message) {

            this.message = message;

            return this;

        }
 
        public ResponseBuilder coach(CoachDto coach) {

            this.coach = coach;

            return this;

        }
 
        public ResponseBuilder coachs(List<CoachDto> coachs) {

            this.coachs = coachs;

            return this;

        }
 
        public ResponseBuilder mentor(MentorDto mentor) {

            this.mentor = mentor;

            return this;

        }
 
        public ResponseBuilder mentorList(List<MentorDto> mentorList) {

            this.mentorList = mentorList;

            return this;

        }
 
        public ResponseBuilder technicalTrainer(TechnicalTrainerDto technicalTrainer) {

            this.technicalTrainer = technicalTrainer;

            return this;

        }
 
        public ResponseBuilder technicalTrainerList(List<TechnicalTrainerDto> technicalTrainerList) {

            this.technicalTrainerList = technicalTrainerList;

            return this;

        }
 
        public ResponseBuilder bhTrainer(BhTrainerDto bhTrainer) {

            this.bhTrainer = bhTrainer;

            return this;

        }
 
        public ResponseBuilder bhTrainerList(List<BhTrainerDto> bhTrainerList) {

            this.bhTrainerList = bhTrainerList;

            return this;

        }
 
        public ResponseBuilder domainName(DomainDto domainName) {

            this.domainName = domainName;

            return this;

        }
 
        public ResponseBuilder domainNameList(List<DomainDto> domainNameList) {

            this.domainNameList = domainNameList;

            return this;

        }
 
        public ResponseBuilder serviceLine(ServiceLineDto serviceLine) {

            this.serviceLine = serviceLine;

            return this;

        }
 
        public ResponseBuilder serviceLines(List<ServiceLineDto> serviceLines) {

            this.serviceLines = serviceLines;

            return this;

        }
 
        public ResponseBuilder cohort(CohortDto cohort) {

            this.cohort = cohort;

            return this;

        }
 
        public ResponseBuilder cohortList(List<CohortDto> cohortList) {

            this.cohortList = cohortList;

            return this;

        }
 
        public ResponseBuilder trainee(TraineeDto trainee) {

            this.trainee = trainee;

            return this;

        }
 
        public ResponseBuilder traineeList(List<TraineeDto> traineeList) {

            this.traineeList = traineeList;

            return this;

        }
 
        public ResponseBuilder location(LocationDto location) {

            this.location = location;

            return this;

        }
 
        public ResponseBuilder locationList(List<LocationDto> locationList) {

            this.locationList = locationList;

            return this;

        }
 
        public ResponseBuilder hireType(HireTypeDto hireType) {

            this.hireType = hireType;

            return this;

        }
 
        public ResponseBuilder hireTypeList(List<HireTypeDto> hireTypeList) {

            this.hireTypeList = hireTypeList;

            return this;

        }
 
        public ResponseBuilder vertical(VerticalDto vertical) {

            this.vertical = vertical;

            return this;

        }
 
        public ResponseBuilder verticalList(List<VerticalDto> verticalList) {

            this.verticalList = verticalList;

            return this;

        }
 
        public ResponseBuilder learningPath(LearningPathDto learningPath) { // Builder method for LearningPathDto

            this.learningPath = learningPath;

            return this;

        }

        public ResponseBuilder learningPaths(List<LearningPathDto> learningPaths) { // Builder method for LearningPathDto

            this.learningPaths = learningPaths;

            return this;

        }
        
        public ResponseBuilder registeredAssociate(RegisterAssociateDto registerAssociate) { // Builder method for LearningPathDto

            this.registeredAssociate = registerAssociate;

            return this;

        }
        
        public ResponseBuilder registeredAssociates(List<RegisterAssociateDto> registerAssociates) { // Builder method for LearningPathDto

            this.registeredAssociates = registerAssociates;

            return this;

        }

        public ResponseBuilder event(EventDTO event) {
            this.event = event;
            return this;
        }

        public ResponseBuilder events(List<EventDTO> events) {
            this.events = events;
            return this;
        }
        public ResponseBuilder bulkResults(List<BulkRowResultDto> bulkResults) {
            this.bulkResults = bulkResults;
            return this;
        }
 
        public Response build() {

            return new Response(status, message, coach, coachs, mentor, mentorList,

                                technicalTrainer, technicalTrainerList, bhTrainer, bhTrainerList,

                                domainName, domainNameList, serviceLine, serviceLines, cohort, cohortList,

                                trainee, traineeList, location, locationList, hireType, hireTypeList,

                                vertical, verticalList, learningPath,learningPaths,registeredAssociate,registeredAssociates,event,events, bulkResults);

        }

    }

}
 