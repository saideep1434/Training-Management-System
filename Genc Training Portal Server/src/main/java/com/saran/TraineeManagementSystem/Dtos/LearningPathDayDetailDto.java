package com.saran.TraineeManagementSystem.Dtos;
 
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
 
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class LearningPathDayDetailDto {
 
    // No ID here if it's for creation
    private Long dayNumber;
    private String topic;
    private String description;
 
    // Constructors
    public LearningPathDayDetailDto() {}
 
    public LearningPathDayDetailDto(Long dayNumber, String topic, String description) {
        this.dayNumber = dayNumber;
        this.topic = topic;
        this.description = description;
    }
 
    // Getters and Setters
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
}