package com.webhookdemo.controller;

import com.webhookdemo.dto.AdminDto;
import com.webhookdemo.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @PostMapping("/register")
    public ResponseEntity<AdminDto> registerAdmin(@Valid @RequestBody AdminDto adminDto) {
        try {
            AdminDto registeredAdmin = adminService.registerAdmin(adminDto);
            return new ResponseEntity<>(registeredAdmin, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AdminDto> loginAdmin(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            AdminDto admin = adminService.loginAdmin(email, password);
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AdminDto> getAdminById(@PathVariable Long id) {
        Optional<AdminDto> admin = adminService.getAdminById(id);
        return admin.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/by-email/{email}")
    public ResponseEntity<AdminDto> getAdminByEmail(@PathVariable String email) {
        Optional<AdminDto> admin = adminService.getAdminByEmail(email);
        return admin.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AdminDto> updateAdmin(@PathVariable Long id, @Valid @RequestBody AdminDto adminDto) {
        try {
            AdminDto updatedAdmin = adminService.updateAdmin(id, adminDto);
            return ResponseEntity.ok(updatedAdmin);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}