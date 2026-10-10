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

@Entity
public class BHTrainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bhTrainerId;

    @Column(nullable = false, length = 50)
    private String bhTrainerName;

    @Column(nullable = false, unique = true, length = 100)
    private String bhTrainerEmail;

    @Column(nullable = false, unique = true, length = 20)
    private String bhTrainerAssociateId;
    
    @Column(nullable = false, length = 10)
    private String status = "free";

    @OneToMany(mappedBy = "bhTrainer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cohort> cohorts = new ArrayList<>();

    public BHTrainer() {
    }

    public BHTrainer(Long bhTrainerId, String bhTrainerName, String bhTrainerEmail, String bhTrainerAssociateId) {
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

    public List<Cohort> getCohorts() {
        return cohorts;
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

    public void setCohorts(List<Cohort> cohorts) {
        this.cohorts = cohorts;
    }
}