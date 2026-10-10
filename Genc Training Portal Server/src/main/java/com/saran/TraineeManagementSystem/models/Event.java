package com.saran.TraineeManagementSystem.models;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cohort_id", nullable = false)
    private Long cohortId;   // ✅ Just store the cohort ID

    private String eventCreatorAssociateId;

    // Use converter to tolerate legacy values and synonyms
    @Convert(converter = EventTypeConverter.class)
    @Column(name = "event_type", nullable = false)
    private EventType type;

    private Date date;
    private String description;
    private int startHour;
    private int endHour;

    // ===== Enum for Event Types =====
    public enum EventType {
        TRAINER_CONNECT,
        MENTOR_CONNECT,
        COACH_CONNECT,
        BH_TRAINER_CONNECT,
        PROJECT,
        MEETING
    }

    // ===== Constructors =====
    public Event() {}

    public Event(Long cohortId, String eventCreatorAssociateId, EventType type, Date date,
                 String description, int startHour, int endHour) {
        this.cohortId = cohortId;
        this.eventCreatorAssociateId = eventCreatorAssociateId;
        this.type = type;
        this.date = date;
        this.description = description;
        this.startHour = startHour;
        this.endHour = endHour;
    }

    // ===== Getters and Setters =====
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCohortId() {
        return cohortId;
    }

    public void setCohortId(Long cohortId) {
        this.cohortId = cohortId;
    }

    public String getEventCreatorAssociateId() {
        return eventCreatorAssociateId;
    }

    public void setEventCreatorAssociateId(String eventCreatorAssociateId) {
        this.eventCreatorAssociateId = eventCreatorAssociateId;
    }

    public EventType getType() {
        return type;
    }

    public void setType(EventType type) {
        this.type = type;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getStartHour() {
        return startHour;
    }

    public void setStartHour(int startHour) {
        this.startHour = startHour;
    }

    public int getEndHour() {
        return endHour;
    }

    public void setEndHour(int endHour) {
        this.endHour = endHour;
    }
}
