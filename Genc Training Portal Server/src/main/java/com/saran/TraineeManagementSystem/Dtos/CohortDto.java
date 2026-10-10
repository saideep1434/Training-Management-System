package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.saran.TraineeManagementSystem.models.TechnicalTrainer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class CohortDto {

    private Long cohortId;

    @NotBlank(message = "Cohort code is mandatory")
    @Size(min = 3, max = 20, message = "Cohort code must be between 3 and 20 characters")
    private String cohortCode;

    @NotBlank(message = "Domain name is mandatory")
    private String domainName;

    //added on 14/09/25, we need the technical trainer details for trainer connect so just adding to check it
    @NotNull(message = "Technical Trainer details are mandatory")
    private TechnicalTrainerDto technicalTrainer;

    @NotNull(message = "coach details are mandatory")
    private CoachDto coach;

    @NotNull(message = "Mentor details are mandatory")
    private MentorDto mentor;


    @NotNull(message = "BH Trainer details are mandatory")
    private BhTrainerDto bhTrainer;


    @NotBlank(message = "Location is mandatory")
    private String location;

    @NotBlank(message = "Hire Type is mandatory")
    private String hireType;

    @NotBlank(message = "Vertical is mandatory")
    private String vertical;

    @NotBlank(message = "Service Line is mandatory")
    private String serviceLine;
    
    @NotNull(message= "Learning Path Id cannot be null")
    private Long learningPathId;

    @NotBlank(message = "Date of Joining is mandatory and must be in YYYY-MM-DD format")
    private String dateOfJoining;

    @NotBlank(message = "Training Start Date is mandatory and must be in YYYY-MM-DD format")
    private String trainingStartDate;

    @NotBlank(message = "Training End Date is mandatory and must be in YYYY-MM-DD format")
    private String trainingEndDate;

    public CohortDto() {
    }

    public CohortDto(Long cohortId, String cohortCode, String domainName, String location,
                     String hireType, String vertical, String serviceLine,
                     String dateOfJoining, String trainingStartDate, String trainingEndDate, Long learningPathId, TechnicalTrainerDto technicalTrainer, CoachDto coach, MentorDto mentor, BhTrainerDto bhTrainer) {
        this.cohortId = cohortId;
        this.cohortCode = cohortCode;
        this.domainName = domainName;
        this.location = location;
        this.hireType = hireType;
        this.vertical = vertical;
        this.serviceLine = serviceLine;
        this.dateOfJoining = dateOfJoining;
        this.trainingStartDate = trainingStartDate;
        this.trainingEndDate = trainingEndDate;
        this.learningPathId = learningPathId;
        this.technicalTrainer = technicalTrainer;
        this.coach = coach;
        this.mentor= mentor;
        this.bhTrainer= bhTrainer;
    }

    public Long getCohortId() {
        return cohortId;
    }

    public void setCohortId(Long cohortId) {
        this.cohortId = cohortId;
    }

    public String getCohortCode() {
        return cohortCode;
    }

    public void setCohortCode(String cohortCode) {
        this.cohortCode = cohortCode;
    }

    public String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        this.domainName = domainName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getHireType() {
        return hireType;
    }

    public void setHireType(String hireType) {
        this.hireType = hireType;
    }

    public String getVertical() {
        return vertical;
    }

    public void setVertical(String vertical) {
        this.vertical = vertical;
    }

    public String getServiceLine() {
        return serviceLine;
    }

    public void setServiceLine(String serviceLine) {
        this.serviceLine = serviceLine;
    }

    public String getDateOfJoining() {
        return dateOfJoining;
    }

    public void setDateOfJoining(String dateOfJoining) {
        this.dateOfJoining = dateOfJoining;
    }

    public String getTrainingStartDate() {
        return trainingStartDate;
    }

    public void setTrainingStartDate(String trainingStartDate) {
        this.trainingStartDate = trainingStartDate;
    }

    public String getTrainingEndDate() {
        return trainingEndDate;
    }

    public void setTrainingEndDate(String trainingEndDate) {
        this.trainingEndDate = trainingEndDate;
    }
    
    public Long getLearningPathId() {
    	return this.learningPathId;
    }
    
    public void setLearningPathId(Long learningPathId) {
    	this.learningPathId = learningPathId;
    }

    public TechnicalTrainerDto getTechnicalTrainer() {
        return technicalTrainer;
    }

    public void setTechnicalTrainer(TechnicalTrainerDto technicalTrainerDto) {

        this.technicalTrainer = technicalTrainerDto;
    }

    public CoachDto getCoach() {
        return coach;
    }

    public void setCoach(CoachDto coach) {
        this.coach = coach;
    }

    public MentorDto getMentor() {
        return mentor;
    }

    public void setMentor(MentorDto mentor) {
        this.mentor = mentor;
    }

    public BhTrainerDto getBhTrainer() {
        return bhTrainer;
    }

    public void setBhTrainer(BhTrainerDto bhTrainer) {
        this.bhTrainer = bhTrainer;
    }
}