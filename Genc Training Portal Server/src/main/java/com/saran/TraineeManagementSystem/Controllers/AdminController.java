package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.RegisterAssociateDto;
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.services.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController 
@RequestMapping("/api/admin/associate")
public class AdminController {

    private final AdminService adminService; 


    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }
    
    
    @PostMapping("/add")
    public ResponseEntity<Response> addAssociate(@RequestBody RegisterAssociateDto associateDto) {
        Response response = adminService.addAssociate(associateDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

 
    @GetMapping("/{id}")
    public ResponseEntity<Response> getAssociateById(@PathVariable Long id) {
        Response response = adminService.getAssociateById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

   
    @GetMapping("/all")
    public ResponseEntity<Response> getAllAssociates() {
        Response response = adminService.getAllAssociates();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    
    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateAssociate(@PathVariable Long id, @RequestBody RegisterAssociateDto updatedAssociateDto) {
        Response response = adminService.updateAssociate(id, updatedAssociateDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteAssociate(@PathVariable Long id) {
        Response response = adminService.deleteAssociate(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
