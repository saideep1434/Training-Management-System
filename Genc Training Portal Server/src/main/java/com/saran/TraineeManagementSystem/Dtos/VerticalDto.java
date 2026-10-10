package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class VerticalDto {

    private Long verticalId; // Added for retrieving/updating by ID

    @NotBlank(message = "Vertical name is mandatory")
    @Size(min = 2, max = 100, message = "Vertical name must be between 2 and 100 characters")
    private String verticalName;

    @NotBlank(message = "Domain name is mandatory")
    @Size(min = 2, max = 100, message = "Domain name must be between 2 and 100 characters")
    private String domainName;

    public VerticalDto() {
    }

    public VerticalDto(Long verticalId, String verticalName, String domainName) {
        this.verticalId = verticalId;
        this.verticalName = verticalName;
        this.domainName = domainName;
    }

    public Long getVerticalId() {
        return verticalId;
    }

    public void setVerticalId(Long verticalId) {
        this.verticalId = verticalId;
    }

    public String getVerticalName() {
        return verticalName;
    }

    public void setVerticalName(String verticalName) {
        this.verticalName = verticalName;
    }

    public String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        this.domainName = domainName;
    }
}