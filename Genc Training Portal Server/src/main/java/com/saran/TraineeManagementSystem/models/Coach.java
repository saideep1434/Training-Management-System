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
public class Coach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long coachId;

    @NotBlank(message = "Coach name is mandatory")
    @Size(min = 2, max = 50, message = "Coach name must be between 2 and 50 characters")
    @Column(nullable = false, length = 50)
    private String coachName;

    @NotBlank(message = "Coach email is mandatory")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true, length = 100)
    private String coachEmail;

    @NotBlank(message = "Coach associate ID is mandatory")
    @Size(min = 5, max = 20, message = "Coach associate ID must be between 5 and 20 characters")
    @Column(nullable = false, unique = true, length = 20)
    private String coachAssociateId;
    
    @Column(nullable = false, length = 10)
    private String status = "free";

    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cohort> cohorts = new ArrayList<>();

    public Coach() {
    }

    public Coach(Long coachId, String coachName, String coachEmail, String coachAssociateId, List<Cohort> cohorts) {
        this.coachId = coachId;
        this.coachName = coachName;
        this.coachEmail = coachEmail;
        this.coachAssociateId = coachAssociateId;
        this.cohorts = (cohorts != null) ? cohorts : new ArrayList<>();
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

    public List<Cohort> getCohorts() {
        return cohorts;
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

    public void setCohorts(List<Cohort> cohorts) {
        this.cohorts = cohorts;
    }
}