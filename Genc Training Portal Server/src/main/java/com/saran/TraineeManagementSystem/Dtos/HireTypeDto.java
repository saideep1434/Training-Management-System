package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class HireTypeDto {

    private Long hireTypeId;

    @NotBlank(message = "Hire type cannot be blank")
    @Size(min = 2, max = 50, message = "Hire type must be between 2 and 50 characters")
    private String hireType;

    public HireTypeDto() {
    }

    public HireTypeDto(Long hireTypeId, String hireType) {
        this.hireTypeId = hireTypeId;
        this.hireType = hireType;
    }

    public Long getHireTypeId() {
        return hireTypeId;
    }

    public void setHireTypeId(Long hireTypeId) {
        this.hireTypeId = hireTypeId;
    }

    public String getHireType() {
        return hireType;
    }

    public void setHireType(String hireType) {
        this.hireType = hireType;
    }
}