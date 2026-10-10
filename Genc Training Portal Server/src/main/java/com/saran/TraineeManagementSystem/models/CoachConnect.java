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
public class CoachConnect {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long coachConnectId;
	private Date date;
	private Long cohortId;
	private Long coachId;
	private String modeOfConnect;
	private boolean acknowledgement;
}
