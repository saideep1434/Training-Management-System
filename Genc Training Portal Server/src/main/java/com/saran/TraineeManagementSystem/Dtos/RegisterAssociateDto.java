package com.saran.TraineeManagementSystem.Dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.saran.TraineeManagementSystem.models.UserRoles;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterAssociateDto {
	
	private Long id;
    private String associateName;
    private String associateId;
    private String associateEmail;
    private String description;
    private UserRoles role;
    private String password;
    
    // No-argument constructor
    public RegisterAssociateDto() {
    }

    // All-argument constructor
    public RegisterAssociateDto(Long id, String associateName, String associateId, String associateEmail, UserRoles role, String password,String description) {
        this.id = id;
    	this.associateName = associateName;
        this.associateId = associateId;
        this.associateEmail = associateEmail;
        this.role = role;
        this.password = password;
        this.description = description;
    }

    // Getters
   

    public String getAssociateName() {
        return associateName;
    }

    public String getAssociateId() {
        return associateId;
    }

    public String getAssociateEmail() {
        return associateEmail;
    }

    public UserRoles getRole() {
        return role;
    }
    
    public String getPassword() {
    	return this.password;
    }

    // Setters
    

    public void setAssociateName(String associateName) {
        this.associateName = associateName;
    }

    public void setAssociateId(String associateId) {
        this.associateId = associateId;
    }

    public void setAssociateEmail(String associateEmail) {
        this.associateEmail = associateEmail;
    }

    public void setRole(UserRoles role) {
        this.role = role;
    }
    
    public void setPassword(String password) {
    	this.password = password;
    }

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public Long getId() {
		return this.id;
	}
	
	public void setid(Long id) {
		this.id = id;
	}

    

    
}
