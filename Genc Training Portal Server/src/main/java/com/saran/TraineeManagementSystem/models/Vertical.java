package com.saran.TraineeManagementSystem.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
public class Vertical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long verticalId;

    @Column(nullable = false, length = 100)
    private String verticalName;

    @ManyToOne
    @JoinColumn(name = "domain_id", nullable = false)
    private Domain domain;

    @OneToMany(mappedBy = "vertical", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cohort> cohorts = new ArrayList<>();

    public Vertical() {
    }

    public Vertical(Long verticalId, String verticalName, Domain domain, List<Cohort> cohorts) {
        this.verticalId = verticalId;
        this.verticalName = verticalName;
        this.domain = domain;
        this.cohorts = (cohorts != null) ? cohorts : new ArrayList<>();
    }

    public Long getVerticalId() {
        return verticalId;
    }

    public void setVerticalId(Long verticalId) {
        this.verticalId = verticalId;
    }

    public String getVerticalName() {
        return verticalName;
    }

    public void setVerticalName(String verticalName) {
        this.verticalName = verticalName;
    }

    public Domain getDomain() {
        return domain;
    }

    public void setDomain(Domain domain) {
        this.domain = domain;
    }

    public List<Cohort> getCohorts() {
        return cohorts;
    }

    public void setCohorts(List<Cohort> cohorts) {
        this.cohorts = cohorts;
    }
}