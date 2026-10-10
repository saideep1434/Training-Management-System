package com.saran.TraineeManagementSystem.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "technical_trainer")
public class TechnicalTrainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long technialTrainerId;

    @NotBlank(message = "Technical Trainer name is mandatory")
    @Size(min = 2, max = 50, message = "Technical Trainer name must be between 2 and 50 characters")
    @Column(nullable = false, length = 50)
    private String techTrainerName;

    @NotBlank(message = "Technical Trainer email is mandatory")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false, length = 100)
    private String techTrainerEmail;

    @NotBlank(message = "Technical Trainer associate ID is mandatory")
    @Size(min = 5, max = 20, message = "Technical Trainer associate ID must be between 5 and 20 characters")
    @Column(unique = true, nullable = false, length = 20)
    private String techTrainerAssociateId;

    @NotBlank(message = "Description is mandatory")
    @Size(max = 50, message = "Description cannot exceed 50 characters")
    @Column(nullable = false, length = 50)
    private String description;

    @Column(nullable = false, length = 10)
    private String status = "free";

    @OneToMany(mappedBy = "technicalTrainer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cohort> cohort = new ArrayList<>();

    public TechnicalTrainer() {
    }

    public TechnicalTrainer(Long technialTrainerId, String techTrainerName, String techTrainerEmail,
                            String techTrainerAssociateId, String description, String status, List<Cohort> cohort) {
        this.technialTrainerId = technialTrainerId;
        this.techTrainerName = techTrainerName;
        this.techTrainerEmail = techTrainerEmail;
        this.techTrainerAssociateId = techTrainerAssociateId;
        this.description = description;
        this.status = status;
        this.cohort = (cohort != null) ? cohort : new ArrayList<>();
    }

    public Long getTechnialTrainerId() {
        return technialTrainerId;
    }

    public void setTechnialTrainerId(Long technialTrainerId) {
        this.technialTrainerId = technialTrainerId;
    }

    public String getTechTrainerName() {
        return techTrainerName;
    }

    public void setTechTrainerName(String techTrainerName) {
        this.techTrainerName = techTrainerName;
    }

    public String getTechTrainerEmail() {
        return techTrainerEmail;
    }

    public void setTechTrainerEmail(String techTrainerEmail) {
        this.techTrainerEmail = techTrainerEmail;
    }

    public String getTechTrainerAssociateId() {
        return techTrainerAssociateId;
    }

    public void setTechTrainerAssociateId(String techTrainerAssociateId) {
        this.techTrainerAssociateId = techTrainerAssociateId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Cohort> getCohort() {
        return cohort;
    }

    public void setCohort(List<Cohort> cohort) {
        this.cohort = cohort;
    }
}