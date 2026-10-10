package com.saran.TraineeManagementSystem.Dtos;

import com.saran.TraineeManagementSystem.models.UserRoles;

public class AssociatePublicDto {
	
	private Long id;
	private String associateName;
	private String associateId;
	private String associateEmail;
	private UserRoles role;
	
	public Long getId() {
		return this.id;
	}
	
	public String getAssociateName() {
		return this.associateName;
	}
	
	public String getAssociateId() {
		return this.associateId;
	}
	
	public String getAssociateEmail() {
		return this.associateEmail;
	}
	
	public UserRoles getRole() {
		return this.role;
	}
	 
	
	
}
