package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TechnicalTrainerDto {

    private Long technialTrainerId; // Added for update/fetch operations
    
    @NotBlank(message = "Technical Trainer name is mandatory")
    @Size(min = 2, max = 50, message = "Technical Trainer name must be between 2 and 50 characters")
    private String techTrainerName;

    @NotBlank(message = "Technical Trainer email is mandatory")
    @Email(message = "Email should be valid")
    private String techTrainerEmail;

    @NotBlank(message = "Technical Trainer associate ID is mandatory")
    @Size(min = 5, max = 20, message = "Technical Trainer associate ID must be between 5 and 20 characters")
    private String techTrainerAssociateId;

    @NotBlank(message = "Description is mandatory")
    @Size(max = 50, message = "Description cannot exceed 50 characters")
    private String description;

    private String status = "free"; // Status can be updated

    public TechnicalTrainerDto() {
    }

    public TechnicalTrainerDto(Long technialTrainerId, String techTrainerName, String techTrainerEmail,
                               String techTrainerAssociateId, String description, String status) {
        this.technialTrainerId = technialTrainerId;
        this.techTrainerName = techTrainerName;
        this.techTrainerEmail = techTrainerEmail;
        this.techTrainerAssociateId = techTrainerAssociateId;
        this.description = description;
        this.status = status;
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
}