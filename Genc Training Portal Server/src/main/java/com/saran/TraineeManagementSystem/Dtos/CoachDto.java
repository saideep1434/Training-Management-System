package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class CoachDto {

    private Long coachId;

    @NotBlank(message = "Coach name is mandatory")
    @Size(min = 2, max = 50, message = "Coach name must be between 2 and 50 characters")
    private String coachName;

    @NotBlank(message = "Coach email is mandatory")
    @Email(message = "Email should be valid")
    private String coachEmail;

    @NotBlank(message = "Coach associate ID is mandatory")
    @Size(min = 5, max = 20, message = "Coach associate ID must be between 5 and 20 characters")
    private String coachAssociateId;

    public CoachDto() {
    }

    public CoachDto(Long coachId, String coachName, String coachEmail, String coachAssociateId) {
        this.coachId = coachId;
        this.coachName = coachName;
        this.coachEmail = coachEmail;
        this.coachAssociateId = coachAssociateId;
    }

    public Long getCoachId() {
        return coachId;
    }

    public String getCoachName() {
        return coachName;
    }

    public String getCoachEmail() {
        return coachEmail;
    }

    public String getCoachAssociateId() {
        return coachAssociateId;
    }

    public void setCoachId(Long coachId) {
        this.coachId = coachId;
    }

    public void setCoachName(String coachName) {
        this.coachName = coachName;
    }

    public void setCoachEmail(String coachEmail) {
        this.coachEmail = coachEmail;
    }

    public void setCoachAssociateId(String coachAssociateId) {
        this.coachAssociateId = coachAssociateId;
    }
}