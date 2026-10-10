package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class LocationDto {

    private Long locationId; // Added for update/fetch operations

    @NotBlank(message = "Location cannot be blank")
    @Size(min = 2, max = 100, message = "Location name must be between 2 and 100 characters")
    private String location;

    public LocationDto() {
    }

    public LocationDto(Long locationId, String location) {
        this.locationId = locationId;
        this.location = location;
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
}