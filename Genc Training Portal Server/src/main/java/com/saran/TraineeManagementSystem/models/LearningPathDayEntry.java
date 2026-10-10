package com.saran.TraineeManagementSystem.models;
 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
 
@Entity
@Table(name = "learning_path_day_entry")
public class LearningPathDayEntry {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dayEntryId; // Unique ID for each daily entry
 
    @NotNull(message = "Day number is mandatory")
    @Min(value = 1, message = "Day number must be at least 1")
    @Column(nullable = false)
    private Long dayNumber;
 
    @NotBlank(message = "Topic is mandatory")
    @Size(min = 2, max = 255, message = "Topic must be between 2 and 255 characters")
    @Column(nullable = false, length = 255)
    private String topic;
 
    @NotBlank(message = "Description is mandatory")
    @Size(min = 5, message = "Description must be at least 5 characters")
    @Column(columnDefinition = "TEXT")
    private String description;
 
    // Many-to-One relationship: Many daily entries belong to one overall LearningPath
    @ManyToOne
    @JoinColumn(name = "learning_path_id", nullable = false) // Foreign key to the LearningPath table
    private LearningPath learningPath;
 
    // --- Constructors ---
    public LearningPathDayEntry() {
    }
 
    public LearningPathDayEntry(Long dayEntryId, Long dayNumber, String topic, String description, LearningPath learningPath) {
        this.dayEntryId = dayEntryId;
        this.dayNumber = dayNumber;
        this.topic = topic;
        this.description = description;
        this.learningPath = learningPath;
    }
 
    // --- Getters and Setters ---
    public Long getDayEntryId() {
        return dayEntryId;
    }
 
    public void setDayEntryId(Long dayEntryId) {
        this.dayEntryId = dayEntryId;
    }
 
    public Long getDayNumber() {
        return dayNumber;
    }
 
    public void setDayNumber(Long dayNumber) {
        this.dayNumber = dayNumber;
    }
 
    public String getTopic() {
        return topic;
    }
 
    public void setTopic(String topic) {
        this.topic = topic;
    }
 
    public String getDescription() {
        return description;
    }
 
    public void setDescription(String description) {
        this.description = description;
    }
 
    public LearningPath getLearningPath() {
        return learningPath;
    }
 
    public void setLearningPath(LearningPath learningPath) {
        this.learningPath = learningPath;
    }
}