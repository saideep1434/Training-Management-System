package com.saran.TraineeManagementSystem.Dtos;

import java.io.Serializable;
import java.util.List;

public class LoginResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private boolean success;
    private String message;
    private String username;
    private List<String> roles;
    private String jwtToken;
    private String associateId; // associate ID of the logged-in user


    public LoginResponse() {}
    // Backward-compatible ctor (without associateId)
    public LoginResponse(boolean success, String message, String username, List<String> roles, String jwtToken) {
        this.success = success;
        this.message = message;
        this.username = username;
        this.roles = roles;
        this.jwtToken = jwtToken;
    }

    // Preferred ctor including associateId
    public LoginResponse(boolean success, String message, String username, List<String> roles, String jwtToken, String associateId) {
        this.success = success;
        this.message = message;
        this.username = username;
        this.roles = roles;
        this.jwtToken = jwtToken;
        this.associateId = associateId;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
    public String getJwtToken() { return jwtToken; }
    public void setJwtToken(String jwtToken) { this.jwtToken = jwtToken; }
    public String getAssociateId() { return associateId; }
    public void setAssociateId(String associateId) { this.associateId = associateId; }

    @Override
    public String toString() {
        return "LoginResponse{success=" + success + ", message='" + message + '\'' +
               ", username='" + username + '\'' + ", roles=" + roles + ", associateId='" + associateId + '\'' +
               ", jwtToken='" + (jwtToken != null ? "[PRESENT]" : "[ABSENT]") + "'}";
    }
}