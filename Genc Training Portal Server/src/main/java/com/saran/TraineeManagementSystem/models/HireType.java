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

@Entity
@Table(name = "hire_type")
public class HireType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hireTypeId;

    @Column(unique = true, nullable = false, length = 50)
    private String hireType;

    @OneToMany(mappedBy = "hireType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cohort> cohorts = new ArrayList<>();

    public HireType() {
    }

    public HireType(Long hireTypeId, String hireType, List<Cohort> cohorts) {
        this.hireTypeId = hireTypeId;
        this.hireType = hireType;
        this.cohorts = (cohorts != null) ? cohorts : new ArrayList<>();
    }

    public Long getHireTypeId() {
        return hireTypeId;
    }

    public void setHireTypeId(Long hireTypeId) {
        this.hireTypeId = hireTypeId;
    }

    public String getHireType() {
        return hireType;
    }

    public void setHireType(String hireType) {
        this.hireType = hireType;
    }

    public List<Cohort> getCohorts() {
        return cohorts;
    }

    public void setCohorts(List<Cohort> cohorts) {
        this.cohorts = cohorts;
    }
}