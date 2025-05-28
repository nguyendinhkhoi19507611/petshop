package com.petshop.controller;

import com.petshop.dto.MessageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/all")
    public ResponseEntity<MessageResponse> allAccess() {
        return ResponseEntity.ok(new MessageResponse(true, "Public Content."));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('KHÁCH HÀNG') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> customerAccess() {
        return ResponseEntity.ok(new MessageResponse(true, "Customer Content."));
    }

    @GetMapping("/employee")
    @PreAuthorize("hasRole('NHÂN VIÊN') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> employeeAccess() {
        return ResponseEntity.ok(new MessageResponse(true, "Employee Board."));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> adminAccess() {
        return ResponseEntity.ok(new MessageResponse(true, "Admin Board."));
    }
}