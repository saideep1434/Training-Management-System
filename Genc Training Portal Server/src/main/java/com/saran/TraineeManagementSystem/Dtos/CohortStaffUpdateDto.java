package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class CohortStaffUpdateDto {

    // Use associate IDs as stable identifiers; any field can be null to skip updating that role
    private String techTrainerAssociateId;
    private String coachAssociateId;
    private String mentorAssociateId;
    private String bhTrainerAssociateId;

    public CohortStaffUpdateDto() {}

    public String getTechTrainerAssociateId() { return techTrainerAssociateId; }
    public void setTechTrainerAssociateId(String techTrainerAssociateId) { this.techTrainerAssociateId = techTrainerAssociateId; }

    public String getCoachAssociateId() { return coachAssociateId; }
    public void setCoachAssociateId(String coachAssociateId) { this.coachAssociateId = coachAssociateId; }

    public String getMentorAssociateId() { return mentorAssociateId; }
    public void setMentorAssociateId(String mentorAssociateId) { this.mentorAssociateId = mentorAssociateId; }

    public String getBhTrainerAssociateId() { return bhTrainerAssociateId; }
    public void setBhTrainerAssociateId(String bhTrainerAssociateId) { this.bhTrainerAssociateId = bhTrainerAssociateId; }
}
