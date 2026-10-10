package com.saran.TraineeManagementSystem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class Trainee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long traineeId;

    @NotBlank(message = "Trainee name is mandatory")
    @Size(min = 2, max = 50, message = "Trainee name must be between 2 and 50 characters")
    @Column(nullable = false, length = 50)
    private String traineeName;

    @NotBlank(message = "Trainee associate ID is mandatory")
    @Size(min = 5, max = 20, message = "Trainee associate ID must be between 5 and 20 characters")
    @Column(unique = true, nullable = false, length = 20)
    private String traineeAssociateId;

    @NotBlank(message = "Trainee email is mandatory")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false, length = 100)
    private String traineeEmail;

    // New fields for assignment and categorization
    @ManyToOne
    private Domain domain;

    // Store skills as a comma-separated string for simplicity
    @Column(length = 1000)
    private String skills;

    @ManyToOne
    private Cohort cohort; // null means unassigned

    public Trainee() {
    }

    public Trainee(Long traineeId, String traineeName, String traineeAssociateId, String traineeEmail) {
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

    public Domain getDomain() {
        return domain;
    }

    public void setDomain(Domain domain) {
        this.domain = domain;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public Cohort getCohort() {
        return cohort;
    }

    public void setCohort(Cohort cohort) {
        this.cohort = cohort;
    }
}