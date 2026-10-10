package com.saran.TraineeManagementSystem.Dtos;
 
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
 
import java.util.List;
 
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class LearningPathBatchRequestDto {
 
    @NotBlank(message = "Service Line name is mandatory")
    @Size(min = 2, max = 50, message = "Service Line name must be between 2 and 50 characters")
    private String serviceLineName;
 
    @NotNull(message = "Total duration in weeks is mandatory")
    @Min(value = 1, message = "Total duration must be at least 1 week")
    private Long totalDurationWeeks;
    

    @NotEmpty(message = "Learning path day details cannot be empty")
    @Valid // Enables validation for each item in the list
    private List<LearningPathDayDetailDto> dayDetails; // Renamed for clarity to match new entity
 
    // Constructors
    public LearningPathBatchRequestDto() {}
 
    public LearningPathBatchRequestDto(String serviceLineName, Long totalDurationWeeks, List<LearningPathDayDetailDto> dayDetails) {
        this.serviceLineName = serviceLineName;
        this.totalDurationWeeks = totalDurationWeeks;
        this.dayDetails = dayDetails;
    }
 
    // Getters and Setters
    public String getServiceLineName() {
        return serviceLineName;
    }
 
    public void setServiceLineName(String serviceLineName) {
        this.serviceLineName = serviceLineName;
    }
 
    public Long getTotalDurationWeeks() {
        return totalDurationWeeks;
    }
 
    public void setTotalDurationWeeks(Long totalDurationWeeks) {
        this.totalDurationWeeks = totalDurationWeeks;
    }
 
    public List<LearningPathDayDetailDto> getDayDetails() {
        return dayDetails;
    }
 
    public void setDayDetails(List<LearningPathDayDetailDto> dayDetails) {
        this.dayDetails = dayDetails;
    }
}