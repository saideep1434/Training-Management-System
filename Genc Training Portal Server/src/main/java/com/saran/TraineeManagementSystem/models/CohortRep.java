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
public class CohortRep {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cohortRepId;
	private Date date;
	private Long cohortId;
	private boolean trainerConnectAcknowledgement;
	private boolean bhConnectAcknowledgement;
	private boolean mentorConnectAcknowledgement;
	private boolean coachConnectAcknowledgement;
}
