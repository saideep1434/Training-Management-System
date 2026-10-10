package com.saran.TraineeManagementSystem.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class Domain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long domainId;

    @NotBlank(message = "Domain name is mandatory")
    @Size(min = 2, max = 50, message = "Domain name must be between 2 and 50 characters")
    private String domainName;

    @OneToMany(mappedBy = "domain", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ServiceLine> serviceLines = new ArrayList<>();

    @OneToMany(mappedBy = "domain", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cohort> cohorts = new ArrayList<>();

    @OneToMany(mappedBy = "domain", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vertical> verticals = new ArrayList<>();
    
    

    public Domain() {
    }

    public Domain(Long domainId, String domainName, List<ServiceLine> serviceLines, List<Cohort> cohorts, List<Vertical> verticals) {
        this.domainId = domainId;
        this.domainName = domainName;
        this.serviceLines = (serviceLines != null) ? serviceLines : new ArrayList<>();
        this.cohorts = (cohorts != null) ? cohorts : new ArrayList<>();
        this.verticals = (verticals != null) ? verticals : new ArrayList<>();
    }

    public Long getDomainId() {
        return domainId;
    }

    public void setDomainId(Long domainId) {
        this.domainId = domainId;
    }

    public String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        this.domainName = domainName;
    }

    public List<ServiceLine> getServiceLines() {
        return serviceLines;
    }

    public void setServiceLines(List<ServiceLine> serviceLines) {
        this.serviceLines = serviceLines;
    }

    public List<Cohort> getCohorts() {
        return cohorts;
    }

    public void setCohorts(List<Cohort> cohorts) {
        this.cohorts = cohorts;
    }

    public List<Vertical> getVerticals() {
        return verticals;
    }

    public void setVerticals(List<Vertical> verticals) {
        this.verticals = verticals;
    }
}