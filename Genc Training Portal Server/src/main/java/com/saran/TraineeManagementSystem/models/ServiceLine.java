package com.saran.TraineeManagementSystem.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne; // Keep OneToOne if one ServiceLine has ONE master LearningPath
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "service_line")
public class ServiceLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceLineId;

    @NotBlank(message = "Track name is mandatory")
    @Size(min = 2, max = 50, message = "Track name must be between 2 and 50 characters")
    @Column(nullable = false, length = 50, unique = true)
    private String trackName;

    @ManyToOne
    @JoinColumn(name = "domain_id", nullable = false)
    private Domain domain;

    @OneToMany(mappedBy = "serviceLine", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cohort> cohorts = new ArrayList<>();

    // One-to-One relationship: Each ServiceLine has one master LearningPath defined.
    // The "mappedBy" attribute is on the owning side (LearningPath) to avoid duplicate column.
    // If you always create/manage LearningPath from ServiceLine side, you might put JoinColumn here.
    // Let's assume LearningPath is the owner of the foreign key for simplicity and uniqueness enforcement.
    @OneToOne(mappedBy = "serviceLine", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private LearningPath learningPath; // This is the overall learning path for this service line

    // --- Constructors ---
    public ServiceLine() {
    }

    public ServiceLine(Long serviceLineId, String trackName, Domain domain, List<Cohort> cohorts, LearningPath learningPath) {
        this.serviceLineId = serviceLineId;
        this.trackName = trackName;
        this.domain = domain;
        this.cohorts = (cohorts != null) ? cohorts : new ArrayList<>();
        this.learningPath = learningPath;
        if (this.learningPath != null && this.learningPath.getServiceLine() != this) {
            this.learningPath.setServiceLine(this);
        }
    }

    // --- Getters and Setters ---
    public Long getServiceLineId() {
        return serviceLineId;
    }

    public void setServiceLineId(Long serviceLineId) {
        this.serviceLineId = serviceLineId;
    }

    public String getTrackName() {
        return trackName;
    }

    public void setTrackName(String trackName) {
        this.trackName = trackName;
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

    public LearningPath getLearningPath() {
        return learningPath;
    }

    public void setLearningPath(LearningPath learningPath) {
        this.learningPath = learningPath;
        if (learningPath != null && learningPath.getServiceLine() != this) {
            learningPath.setServiceLine(this);
        }
    }
}