package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class EventDTO {

    private Long id;

    @NotNull(message = "Cohort ID is required")
    private Long cohortId; // must match Event.cohortId

    @NotBlank(message = "Creator associateId is required")
    private String eventCreatorAssociateId; // must match Event.eventCreatorAssociateId

    @NotBlank(message = "Event type cannot be blank")
    @Size(max = 50, message = "Event type must not exceed 50 characters")
    private String type; // "Trainer Connect", "Mentor Connect", etc.

    @NotBlank(message = "Date is required")
    // You could also use @Pattern if date is in "yyyy-MM-dd" format
    // @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in yyyy-MM-dd format")
    private String date;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 200, message = "Description must not exceed 200 characters")
    private String description;

    @Min(value = 0, message = "Start hour must be >= 0")
    @Max(value = 23, message = "Start hour must be <= 23")
    private int startHour;

    @Min(value = 0, message = "End hour must be >= 0")
    @Max(value = 23, message = "End hour must be <= 23")
    private int endHour;

    // Optional extra fields (uncomment if needed later)
    // private String topicName;
    // private String userId;

    // Default constructor
    public EventDTO() {}

    // All-args constructor
    public EventDTO(Long id, String type, String date, String description, int startHour, int endHour) {
        this.id = id;
        this.type = type;
        this.date = date;
        this.description = description;
        this.startHour = startHour;
        this.endHour = endHour;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public Long getCohortId() { return cohortId; }
    public void setCohortId(Long cohortId) { this.cohortId = cohortId; }

    public String getEventCreatorAssociateId() { return eventCreatorAssociateId; }
    public void setEventCreatorAssociateId(String eventCreatorAssociateId) { this.eventCreatorAssociateId = eventCreatorAssociateId; }

    public String getDate() {
        return date;
    }
    public void setDate(String date) {
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
