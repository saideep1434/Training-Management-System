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
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;

    @Column(unique = true, nullable = false)
    private String location;

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cohort> Cohorts = new ArrayList<>();

    public Location() {
    }

    public Location(Long locationId, String location, List<Cohort> cohorts) {
        this.locationId = locationId;
        this.location = location;
        this.Cohorts = (cohorts != null) ? cohorts : new ArrayList<>();
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<Cohort> getCohorts() {
        return Cohorts;
    }

    public void setCohorts(List<Cohort> cohorts) {
        Cohorts = cohorts;
    }
}