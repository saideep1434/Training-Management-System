package com.saran.TraineeManagementSystem.Controllers; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.CohortDto;
import com.saran.TraineeManagementSystem.Dtos.CohortStaffUpdateDto;
import com.saran.TraineeManagementSystem.Dtos.RegisterAssociateDto;
import com.saran.TraineeManagementSystem.models.Cohort;
import com.saran.TraineeManagementSystem.services.CohortService;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cohorts") // Base URL for Cohort operations
public class CohortController {

    private final CohortService cohortService;

    public CohortController(CohortService cohortService) {
        this.cohortService = cohortService;
    }
    
    // POST /api/cohorts/add
    // Create a new Cohort
    @PostMapping("/add")
    public ResponseEntity<Response> addCohort(@Valid @RequestBody CohortDto cohortDto) {
        Response response = cohortService.addCohort(cohortDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    

    // GET /api/cohorts/all-cohorts
    // Get all Cohorts
    @GetMapping("/all-cohorts")
    public ResponseEntity<Response> getAllCohorts() {
        Response response = cohortService.getAllCohorts();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/cohorts/{id}
    // Get a Cohort by ID
    @GetMapping("/{id}")
    public ResponseEntity<Response> getCohortById(@PathVariable("id") Long id) {
        Response response = cohortService.getCohortById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/cohorts/code/{code}
    // Get a Cohort by cohort code
    @GetMapping("/code/{code}")
    public ResponseEntity<Response> getCohortByCode(@PathVariable String code) {
        Response response = cohortService.getCohortByCode(code);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    @PostMapping("/role-specific")
    public ResponseEntity<Response> getCohortsByRole(@Valid @RequestBody RegisterAssociateDto associate) {
    	Response response = cohortService.getCohortsByRole(associate);
    	return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    
    @GetMapping("trainer/{associateId}")
    public ResponseEntity<Response> getCohortByTrainerId(@PathVariable String associateId) {
    	Response response = cohortService.getCohortsByTechnicalTrainerAssociateId(associateId);
    	return ResponseEntity.status(response.getStatus()).body(response);
    }

    // PUT /api/cohorts/update/{id}
    // Update a Cohort by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateCohort(@PathVariable Long id, @Valid @RequestBody CohortDto cohortDto) {
        Response response = cohortService.updateCohort(id, cohortDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // DELETE /api/cohorts/delete/{id}
    // Delete a Cohort by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteCohort(@PathVariable Long id) {
        Response response = cohortService.deleteCohort(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    // PUT /api/cohorts/{id}/staff
    // Admin-only: Update staff assignments for a cohort
    @PutMapping("/{id}/staff")
    public ResponseEntity<Response> updateCohortStaff(@PathVariable("id") Long id, @RequestBody CohortStaffUpdateDto staffDto) {
        Response response = cohortService.updateCohortStaff(id, staffDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    
    
}