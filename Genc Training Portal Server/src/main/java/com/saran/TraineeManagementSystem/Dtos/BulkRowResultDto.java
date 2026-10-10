package com.saran.TraineeManagementSystem.Dtos;

public class BulkRowResultDto {
    private int index; // 0-based index of the input row
    private String traineeAssociateId;
    private String traineeEmail;
    private String status; // CREATED, UPDATED, SKIPPED, FAILED
    private String reason; // Optional failure/skip reason

    public BulkRowResultDto() {}

    public BulkRowResultDto(int index, String traineeAssociateId, String traineeEmail, String status, String reason) {
        this.index = index;
        this.traineeAssociateId = traineeAssociateId;
        this.traineeEmail = traineeEmail;
        this.status = status;
        this.reason = reason;
    }

    public int getIndex() { return index; }
    public void setIndex(int index) { this.index = index; }

    public String getTraineeAssociateId() { return traineeAssociateId; }
    public void setTraineeAssociateId(String traineeAssociateId) { this.traineeAssociateId = traineeAssociateId; }

    public String getTraineeEmail() { return traineeEmail; }
    public void setTraineeEmail(String traineeEmail) { this.traineeEmail = traineeEmail; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
