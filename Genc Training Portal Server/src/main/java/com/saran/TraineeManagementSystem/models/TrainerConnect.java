package com.saran.TraineeManagementSystem.models;

import java.sql.Date;
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
public class TrainerConnect {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long trainerConnectId;

	private Date date;
	private Long cohortId;
	private Long trainerId;
	private Long contributionHrs;
	private String topics;
	private String modeOfTraining;
	private boolean acknowledgement;

	/**
	 * Update current instance with values from another TrainerConnect instance.
	 */
	public void updateFrom(TrainerConnect trainerConnect) {
		this.date = trainerConnect.getDate();
		this.cohortId = trainerConnect.getCohortId();
		this.trainerId = trainerConnect.getTrainerId();
		this.contributionHrs = trainerConnect.getContributionHrs();
		this.topics = trainerConnect.getTopics();
		this.modeOfTraining = trainerConnect.getModeOfTraining();
		this.acknowledgement = trainerConnect.isAcknowledgement();
	}

	private boolean isAcknowledgement() {
		return this.acknowledgement;
	}

	private String getModeOfTraining() {
		return this.modeOfTraining;
	}

	private String getTopics() {
		return this.topics;
	}

	private Long getContributionHrs() {
		return this.contributionHrs;
	}

	private Long getTrainerId() {
		return this.trainerId;
	}

	private Long getCohortId() {
		return this.cohortId;
	}

	private Date getDate() {
		return this.date;
	}


}
