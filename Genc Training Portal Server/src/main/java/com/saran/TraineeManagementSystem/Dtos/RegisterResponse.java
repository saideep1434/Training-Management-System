// src/main/java/com/example/springsecuritydemo/dto/RegisterResponse.java
package com.saran.TraineeManagementSystem.Dtos;

import java.io.Serializable;

public class RegisterResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private boolean success;
    private String message;
    private String username;
    private Long userId;

    public RegisterResponse() {}
    public RegisterResponse(boolean success, String message, String username, Long userId) {
        this.success = success;
        this.message = message;
        this.username = username;
        this.userId = userId;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    @Override
    public String toString() {
        return "RegisterResponse{success=" + success + ", message='" + message + '\'' +
               ", username='" + username + '\'' + ", userId=" + userId + '}';
    }
}