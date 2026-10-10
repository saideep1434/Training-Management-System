package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.RegisterAssociateDto;
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.TechnicalTrainerDto;
import com.saran.TraineeManagementSystem.models.UserRoles;
import com.saran.TraineeManagementSystem.services.AdminService;
import com.saran.TraineeManagementSystem.services.TechTrainerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/tech-trainer")
public class TechTrainerController {

    private final TechTrainerService techTrainerService;
    
    private final AdminService adminService;

    @Autowired
    public TechTrainerController(TechTrainerService techTrainerService, AdminService adminService) {
        this.techTrainerService = techTrainerService;
        this.adminService = adminService;
    }

    @GetMapping("/all-tech-trainers")
    public ResponseEntity<Response> getAllTechTrainers() {
        Response response = techTrainerService.getAllTechTrainer();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Response> getTechTrainerByName(@PathVariable String name) {
        Response response = techTrainerService.getTechTrainerByName(name);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/associateId/{associateId}")
    public ResponseEntity<Response> getTechTrainerByAssociateId(@PathVariable String associateId) {
        Response response = techTrainerService.getTechTrainerByAssociateId(associateId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/add")
    public ResponseEntity<Response> addTechTrainer(@Valid @RequestBody TechnicalTrainerDto technicalTrainerDto) {
    	RegisterAssociateDto associateDto = new RegisterAssociateDto();
    	
    	associateDto.setAssociateId(technicalTrainerDto.getTechTrainerAssociateId());
    	associateDto.setAssociateName(technicalTrainerDto.getTechTrainerName());
    	associateDto.setAssociateEmail(technicalTrainerDto.getTechTrainerEmail());
    	associateDto.setDescription(technicalTrainerDto.getDescription());
    	associateDto.setRole(UserRoles.TECHNICAL_TRAINER);
    	

    	Response response = adminService.addAssociate(associateDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    	
//    	Response response = techTrainerService.addTechTrainer(technicalTrainerDto);
//        
//        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateTechTrainer(@PathVariable Long id, @Valid @RequestBody TechnicalTrainerDto technicalTrainerDto) {
        Response response = techTrainerService.updateTechTrainer(id, technicalTrainerDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteTechTrainer(@PathVariable Long id) {
        Response response = techTrainerService.deleteTechTrainer(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}