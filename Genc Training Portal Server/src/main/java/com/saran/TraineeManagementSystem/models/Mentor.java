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
public class Mentor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mentorId;

    @NotBlank(message = "Mentor name is mandatory")
    @Size(min = 2, max = 50, message = "Mentor name must be between 2 and 50 characters")
    @Column(nullable = false, length = 50)
    private String mentorName;

    @NotBlank(message = "Mentor email is mandatory")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false, length = 100)
    private String mentorEmail;

    @NotBlank(message = "Mentor associate ID is mandatory")
    @Size(min = 5, max = 20, message = "Mentor associate ID must be between 5 and 20 characters")
    @Column(unique = true, nullable = false, length = 20)
    private String mentorAssociateId;
    
    @Column(nullable = false, length = 10)
    private String status = "free";

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cohort> cohorts = new ArrayList<>();

    public Mentor() {
    }

    public Mentor(Long mentorId, String mentorName, String mentorEmail, String mentorAssociateId, List<Cohort> cohorts) {
        this.mentorId = mentorId;
        this.mentorName = mentorName;
        this.mentorEmail = mentorEmail;
        this.mentorAssociateId = mentorAssociateId;
        this.cohorts = (cohorts != null) ? cohorts : new ArrayList<>();
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

    public List<Cohort> getCohorts() {
        return cohorts;
    }

    public void setCohorts(List<Cohort> cohorts) {
        this.cohorts = cohorts;
    }
}