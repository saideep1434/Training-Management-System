package com.saran.TraineeManagementSystem.models;

import java.sql.Date;
import java.util.List;
import java.util.ArrayList;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table; // Adding @Table for explicit table name

@Entity
public class Cohort {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cohortId;

    @Column(unique = true, nullable = false, length = 20)
    private String cohortCode;

    @ManyToOne
    @JoinColumn(name = "domain_id", nullable = false)
    private Domain domain;

    @ManyToOne
    @JoinColumn(name = "serviceLine_id", nullable = false)
    private ServiceLine serviceLine;

    @ManyToOne
    @JoinColumn(name = "technicalTrainer_id", nullable = false)
    private TechnicalTrainer technicalTrainer;

    @ManyToOne
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;

    @ManyToOne
    @JoinColumn(name = "bhtrainer_id", nullable = false)
    private BHTrainer bhTrainer;

    @ManyToOne
    @JoinColumn(name = "mentor_id", nullable = false)
    private Mentor mentor;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @ManyToOne
    @JoinColumn(name = "hireType_id", nullable = false)
    private HireType hireType;

    @ManyToOne
    @JoinColumn(name = "vertical_id", nullable = false)
    private Vertical vertical;

    @Column(nullable = false)
    private Date dateOfJoining;

    @Column(nullable = false)
    private Date trainingStartDate;

    @Column(nullable = false)
    private Date trainingEndDate;
    
    @ManyToOne
    @JoinColumn(name = "learningPath_id" , nullable = false)
    private LearningPath learningPath;

    // Assuming TraineeList will be added later if needed, but not in original code
    // @OneToMany(mappedBy = "cohort", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Trainee> TraineeList = new ArrayList<>();

    public Cohort() {
    }

    public Cohort(Long cohortId, String cohortCode, Domain domain, ServiceLine serviceLine,
                  TechnicalTrainer technicalTrainer, Coach coach, BHTrainer bhTrainer,
                  Mentor mentor, Location location, HireType hireType, Vertical vertical,
                  Date dateOfJoining, Date trainingStartDate, Date trainingEndDate, LearningPath learningPath) {
        this.cohortId = cohortId;
        this.cohortCode = cohortCode;
        this.domain = domain;
        this.serviceLine = serviceLine;
        this.technicalTrainer = technicalTrainer;
        this.coach = coach;
        this.bhTrainer = bhTrainer;
        this.mentor = mentor;
        this.location = location;
        this.hireType = hireType;
        this.vertical = vertical;
        this.dateOfJoining = dateOfJoining;
        this.trainingStartDate = trainingStartDate;
        this.trainingEndDate = trainingEndDate;
        this.learningPath = learningPath;
    }

    public Long getCohortId() {
        return cohortId;
    }

    public void setCohortId(Long cohortId) {
        this.cohortId = cohortId;
    }

    public String getCohortCode() {
        return cohortCode;
    }

    public void setCohortCode(String cohortCode) {
        this.cohortCode = cohortCode;
    }

    public Domain getDomain() {
        return domain;
    }

    public void setDomain(Domain domain) {
        this.domain = domain;
    }

    public ServiceLine getServiceLine() {
        return serviceLine;
    }

    public void setServiceLine(ServiceLine serviceLine) {
        this.serviceLine = serviceLine;
    }

    public TechnicalTrainer getTechnicalTrainer() {
        return technicalTrainer;
    }

    public void setTechnicalTrainer(TechnicalTrainer technicalTrainer) {
        this.technicalTrainer = technicalTrainer;
    }

    public Coach getCoach() {
        return coach;
    }

    public void setCoach(Coach coach) {
        this.coach = coach;
    }

    public BHTrainer getBhTrainer() {
        return bhTrainer;
    }

    public void setBhTrainer(BHTrainer bhTrainer) {
        this.bhTrainer = bhTrainer;
    }

    public Mentor getMentor() {
        return mentor;
    }

    public void setMentor(Mentor mentor) {
        this.mentor = mentor;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public HireType getHireType() {
        return hireType;
    }

    public void setHireType(HireType hireType) {
        this.hireType = hireType;
    }

    public Vertical getVertical() {
        return vertical;
    }

    public void setVertical(Vertical vertical) {
        this.vertical = vertical;
    }
    
    public void setLearningPath(LearningPath learningPath) {
    	this.learningPath = learningPath;
    }
    
    public LearningPath getLearningPath() {
    	return this.learningPath;
    }

    public Date getDateOfJoining() {
        return dateOfJoining;
    }

    public void setDateOfJoining(Date dateOfJoining) {
        this.dateOfJoining = dateOfJoining;
    }

    public Date getTrainingStartDate() {
        return trainingStartDate;
    }

    public void setTrainingStartDate(Date trainingStartDate) {
        this.trainingStartDate = trainingStartDate;
    }

    public Date getTrainingEndDate() {
        return trainingEndDate;
    }

    public void setTrainingEndDate(Date trainingEndDate) {
        this.trainingEndDate = trainingEndDate;
    }
}