package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.CoachDto;
import com.saran.TraineeManagementSystem.Dtos.RegisterAssociateDto;
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.models.Coach;
import com.saran.TraineeManagementSystem.models.UserRoles;
import com.saran.TraineeManagementSystem.services.AdminService;
import com.saran.TraineeManagementSystem.services.CoachService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coach")
public class CoachController {

    private final CoachService coachService;
    
    private final AdminService adminService;

    public CoachController(CoachService coachService, AdminService adminService) {
        this.coachService = coachService;
        this.adminService = adminService;
    }

    @GetMapping("/all-coaches")
    public ResponseEntity<Response> getAllCoaches() {
        Response response = coachService.getAllCoaches();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Response> getCoachByName(@PathVariable String name) {
        Response response = coachService.getCoachByName(name);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/associateId/{associateId}")
    public ResponseEntity<Response> getCoachByAssociateId(@PathVariable String associateId) {
        Response response = coachService.getCoachByAssociateId(associateId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/add")
    public ResponseEntity<Response> addCoach(@RequestBody CoachDto coachDto) {
//        Response response = coachService.addCoach(coachDto);
//        return ResponseEntity.status(response.getStatus()).body(response);
        RegisterAssociateDto associateDto = new RegisterAssociateDto();
        associateDto.setAssociateEmail(coachDto.getCoachEmail());
        associateDto.setAssociateId(coachDto.getCoachAssociateId());
        associateDto.setAssociateName(coachDto.getCoachName());
        associateDto.setRole(UserRoles.COACH);
        
        Response response = adminService.addAssociate(associateDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateCoach(@PathVariable Long id, @RequestBody CoachDto coachDto) {
        Response response = coachService.updateCoach(id, coachDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteCoach(@PathVariable Long id) {
        Response response = coachService.deleteCoach(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
