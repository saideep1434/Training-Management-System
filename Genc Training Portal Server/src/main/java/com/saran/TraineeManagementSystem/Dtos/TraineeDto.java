package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TraineeDto {

    private Long traineeId;

    @NotBlank(message = "Trainee name is mandatory")
    @Size(min = 2, max = 50, message = "Trainee name must be between 2 and 50 characters")
    private String traineeName;

    @NotBlank(message = "Trainee associate ID is mandatory")
    @Size(min = 5, max = 20, message = "Trainee associate ID must be between 5 and 20 characters")
    private String traineeAssociateId;

    @NotBlank(message = "Trainee email is mandatory")
    @Email(message = "Email should be valid")
    private String traineeEmail;

    // New fields
    private String domainName; // domain name label
    private String skills; // comma-separated skills
    private Long cohortId; // nullable when unassigned

    public TraineeDto() {
    }

    public TraineeDto(Long traineeId, String traineeName, String traineeAssociateId, String traineeEmail) {
        this.traineeId = traineeId;
        this.traineeName = traineeName;
        this.traineeAssociateId = traineeAssociateId;
        this.traineeEmail = traineeEmail;
    }

    public Long getTraineeId() {
        return traineeId;
    }

    public void setTraineeId(Long traineeId) {
        this.traineeId = traineeId;
    }

    public String getTraineeName() {
        return traineeName;
    }

    public void setTraineeName(String traineeName) {
        this.traineeName = traineeName;
    }

    public String getTraineeAssociateId() {
        return traineeAssociateId;
    }

    public void setTraineeAssociateId(String traineeAssociateId) {
        this.traineeAssociateId = traineeAssociateId;
    }

    public String getTraineeEmail() {
        return traineeEmail;
    }

    public void setTraineeEmail(String traineeEmail) {
        this.traineeEmail = traineeEmail;
    }

    public String getDomainName() { return domainName; }
    public void setDomainName(String domainName) { this.domainName = domainName; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public Long getCohortId() { return cohortId; }
    public void setCohortId(Long cohortId) { this.cohortId = cohortId; }
}