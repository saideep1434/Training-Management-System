// src/main/java/com/example/springsecuritydemo/dto/RegisterRequest.java
package com.saran.TraineeManagementSystem.Dtos;

import java.io.Serializable;

public class RegisterRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String username;
    private String password;

    public RegisterRequest() {}
    public RegisterRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    @Override
    public String toString() {
        return "RegisterRequest{username='" + username + "', password='[PROTECTED]'}";
    }
}