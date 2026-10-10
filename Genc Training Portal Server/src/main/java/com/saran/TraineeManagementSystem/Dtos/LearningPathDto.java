package com.saran.TraineeManagementSystem.Dtos;
 
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
 
import java.util.List;
 
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class LearningPathDto {
 
    private Long learningPathId; // ID of the overall learning path
    private Long durationWeeks;
    private String serviceLineName; // Name of the associated service line
 
    private List<LearningPathDayDetailDto> dayDetails; // List of individual day details
 
    // Constructors
    public LearningPathDto() {}
 
    public LearningPathDto(Long learningPathId, Long durationWeeks, String serviceLineName, List<LearningPathDayDetailDto> dayDetails) {
        this.learningPathId = learningPathId;
        this.durationWeeks = durationWeeks;
        this.serviceLineName = serviceLineName;
        this.dayDetails = dayDetails;
    }
 
    // Getters and Setters
    public Long getLearningPathId() {
        return learningPathId;
    }
 
    public void setLearningPathId(Long learningPathId) {
        this.learningPathId = learningPathId;
    }
 
    public Long getDurationWeeks() {
        return durationWeeks;
    }
 
    public void setDurationWeeks(Long durationWeeks) {
        this.durationWeeks = durationWeeks;
    }
 
    public String getServiceLineName() {
        return serviceLineName;
    }
 
    public void setServiceLineName(String serviceLineName) {
        this.serviceLineName = serviceLineName;
    }
 
    public List<LearningPathDayDetailDto> getDayDetails() {
        return dayDetails;
    }
 
    public void setDayDetails(List<LearningPathDayDetailDto> dayDetails) {
        this.dayDetails = dayDetails;
    }
}