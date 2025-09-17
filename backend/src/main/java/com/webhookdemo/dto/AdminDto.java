package com.webhookdemo.dto;

import com.webhookdemo.entity.Admin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class AdminDto {
    
    private Long id;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String password; // Only used for registration/login
    
    private Admin.Role role;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    
    // Constructors
    public AdminDto() {}
    
    public AdminDto(Admin admin) {
        this.id = admin.getId();
        this.email = admin.getEmail();
        this.name = admin.getName();
        this.role = admin.getRole();
        this.lastLogin = admin.getLastLogin();
        this.createdAt = admin.getCreatedAt();
        // Don't include password in DTO for security
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public Admin.Role getRole() { return role; }
    public void setRole(Admin.Role role) { this.role = role; }
    
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}