package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ServiceLineDto {

    private Long serviceLineId; // Added for update/fetch operations

    @NotBlank(message = "Track name is mandatory")
    @Size(min = 2, max = 50, message = "Track name must be between 2 and 50 characters")
    private String trackName;

    private String domainName;

    public ServiceLineDto() {
    }

    public ServiceLineDto(Long serviceLineId, String trackName, String domainName) {
        this.serviceLineId = serviceLineId;
        this.trackName = trackName;
        this.domainName = domainName;
    }

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

    public String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        this.domainName = domainName;
    }
}