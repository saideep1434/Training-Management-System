package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MentorDto {

    private Long mentorId;

    @NotBlank(message = "Mentor name is mandatory")
    @Size(min = 2, max = 50, message = "Mentor name must be between 2 and 50 characters")
    private String mentorName;

    @NotBlank(message = "Mentor email is mandatory")
    @Email(message = "Email should be valid")
    private String mentorEmail;

    @NotBlank(message = "Mentor associate ID is mandatory")
    @Size(min = 5, max = 20, message = "Mentor associate ID must be between 5 and 20 characters")
    private String mentorAssociateId;

    public MentorDto() {
    }

    public MentorDto(Long mentorId, String mentorName, String mentorEmail, String mentorAssociateId) {
        this.mentorId = mentorId;
        this.mentorName = mentorName;
        this.mentorEmail = mentorEmail;
        this.mentorAssociateId = mentorAssociateId;
    }

    public Long getMentorId() {
        return mentorId;
    }

    public void setMentorId(Long mentorId) {
        this.mentorId = mentorId;
    }

    public String getMentorName() {
        return mentorName;
    }

    public void setMentorName(String mentorName) {
        this.mentorName = mentorName;
    }

    public String getMentorEmail() {
        return mentorEmail;
    }

    public void setMentorEmail(String mentorEmail) {
        this.mentorEmail = mentorEmail;
    }

    public String getMentorAssociateId() {
        return mentorAssociateId;
    }

    public void setMentorAssociateId(String mentorAssociateId) {
        this.mentorAssociateId = mentorAssociateId;
    }
}