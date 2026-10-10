package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class DomainDto {

    @NotBlank(message = "Domain name is mandatory")
    @Size(min = 2, max = 50, message = "Domain name must be between 2 and 50 characters")
    private String domainName;

    public DomainDto() {
    }

    public DomainDto(String domainName) {
        this.domainName = domainName;
    }

    public String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        this.domainName = domainName;
    }
}