package com.saran.TraineeManagementSystem.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class RegisterAssociate {

	@Id
	@GeneratedValue(strategy  = GenerationType.IDENTITY)
	private Long id;
	private String associateName;
	private String associateId;
	private String associateEmail;
	
	@Enumerated(EnumType.STRING)
	private UserRoles role;
	
	private String password;
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getAssociateName() {
		return associateName;
	}
	public void setAssociateName(String associateName) {
		this.associateName = associateName;
	}
	public String getAssociateId() {
		return associateId;
	}
	public void setAssociateId(String associateId) {
		this.associateId = associateId;
	}
	public String getAssociateEmail() {
		return associateEmail;
	}
	public void setAssociateEmail(String associateEmail) {
		this.associateEmail = associateEmail;
	}
	public UserRoles getRole() {
		return role;
	}
	public void setRole(UserRoles role) {
		this.role = role;
	}
	public String getPassword() {
		return this.password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	
}
