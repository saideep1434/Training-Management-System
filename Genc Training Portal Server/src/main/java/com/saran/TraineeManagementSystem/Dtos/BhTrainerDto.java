package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class BhTrainerDto {

    private Long bhTrainerId;

    @NotBlank(message = "BH Trainer name is mandatory")
    @Size(min = 2, max = 50, message = "BH Trainer name must be between 2 and 50 characters")
    private String bhTrainerName;

    @NotBlank(message = "BH Trainer email is mandatory")
    @Email(message = "Email should be valid")
    private String bhTrainerEmail;

    @NotBlank(message = "BH Trainer associate ID is mandatory")
    @Size(min = 5, max = 20, message = "BH Trainer associate ID must be between 5 and 20 characters")
    private String bhTrainerAssociateId;

    public BhTrainerDto() {
    }

    public BhTrainerDto(Long bhTrainerId, String bhTrainerName, String bhTrainerEmail, String bhTrainerAssociateId) {
        this.bhTrainerId = bhTrainerId;
        this.bhTrainerName = bhTrainerName;
        this.bhTrainerEmail = bhTrainerEmail;
        this.bhTrainerAssociateId = bhTrainerAssociateId;
    }

    public Long getBhTrainerId() {
        return bhTrainerId;
    }

    public String getBhTrainerName() {
        return bhTrainerName;
    }

    public String getBhTrainerEmail() {
        return bhTrainerEmail;
    }

    public String getBhTrainerAssociateId() {
        return bhTrainerAssociateId;
    }

    public void setBhTrainerId(Long bhTrainerId) {
        this.bhTrainerId = bhTrainerId;
    }

    public void setBhTrainerName(String bhTrainerName) {
        this.bhTrainerName = bhTrainerName;
    }

    public void setBhTrainerEmail(String bhTrainerEmail) {
        this.bhTrainerEmail = bhTrainerEmail;
    }

    public void setBhTrainerAssociateId(String bhTrainerAssociateId) {
        this.bhTrainerAssociateId = bhTrainerAssociateId;
    }
}