package com.saran.TraineeManagementSystem.models;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BHConnect {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bhConnectId;
	private Date date;
	private Long cohortId;
	private Long bhTrainerId;
	private Long contributionHrs;
	private String topics;
	private String modeOfTraining;
	private boolean acknowledgement;
}
