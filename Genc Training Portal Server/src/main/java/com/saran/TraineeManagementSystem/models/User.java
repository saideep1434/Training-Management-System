package com.saran.TraineeManagementSystem.models;

import jakarta.persistence.*;
import java.util.Collection;
import java.util.Collections; // Import for Collections.emptyList()
import java.util.HashSet; // Still needed for some implementations, but won't be used for roles here
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Still useful if you return a default
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "users")
public class User implements UserDetails { // IMPORTANT: Implement UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    
    
    
    private boolean enabled = true; // Default to true for new users


    // Default constructor (required by JPA)
    public User() {}

    // You can add a constructor for convenience if needed
    public User(String username, String password) { // Constructor without roles
        this.username = username;
        this.password = password;
        this.enabled = true; // Default
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }


    // --- UserDetails Interface Implementations ---
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Since we are temporarily removing actual roles,
        // you have a few options here:

        // Option 1: Return an empty list (most accurate if no roles are assigned)
        return Collections.emptyList();

        // Option 2: Return a default "ROLE_USER"
        // This is useful if your security config expects at least one role,
        // even if it's not stored in the DB. However, it means every user
        // will implicitly have this role for authorization purposes.
        // return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // For simplicity, assume not expired
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // For simplicity, assume not locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // For simplicity, assume not expired
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}