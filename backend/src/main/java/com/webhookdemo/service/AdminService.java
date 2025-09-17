package com.webhookdemo.service;

import com.webhookdemo.dto.AdminDto;
import com.webhookdemo.entity.Admin;
import com.webhookdemo.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public AdminDto registerAdmin(AdminDto adminDto) {
        if (adminRepository.existsByEmail(adminDto.getEmail())) {
            throw new RuntimeException("Admin with this email already exists");
        }
        
        Admin admin = new Admin();
        admin.setEmail(adminDto.getEmail());
        admin.setName(adminDto.getName());
        admin.setPassword(passwordEncoder.encode(adminDto.getPassword()));
        admin.setRole(Admin.Role.ADMIN);
        
        Admin savedAdmin = adminRepository.save(admin);
        return new AdminDto(savedAdmin);
    }
    
    public AdminDto loginAdmin(String email, String password) {
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(password, admin.getPassword())) {
                // Update last login
                admin.setLastLogin(LocalDateTime.now());
                adminRepository.save(admin);
                
                return new AdminDto(admin);
            } else {
                throw new RuntimeException("Invalid credentials");
            }
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
    
    public Optional<AdminDto> getAdminById(Long id) {
        return adminRepository.findById(id).map(AdminDto::new);
    }
    
    public Optional<AdminDto> getAdminByEmail(String email) {
        return adminRepository.findByEmail(email).map(AdminDto::new);
    }
    
    public AdminDto updateAdmin(Long id, AdminDto adminDto) {
        Optional<Admin> adminOpt = adminRepository.findById(id);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            
            if (adminDto.getName() != null) {
                admin.setName(adminDto.getName());
            }
            if (adminDto.getEmail() != null && !adminDto.getEmail().equals(admin.getEmail())) {
                if (adminRepository.existsByEmail(adminDto.getEmail())) {
                    throw new RuntimeException("Email already exists");
                }
                admin.setEmail(adminDto.getEmail());
            }
            if (adminDto.getPassword() != null && !adminDto.getPassword().isEmpty()) {
                admin.setPassword(passwordEncoder.encode(adminDto.getPassword()));
            }
            
            Admin updatedAdmin = adminRepository.save(admin);
            return new AdminDto(updatedAdmin);
        } else {
            throw new RuntimeException("Admin not found");
        }
    }
}