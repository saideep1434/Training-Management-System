package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.TraineeDto;
import com.saran.TraineeManagementSystem.services.TraineeService;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainee")
public class TraineeController {

    private final TraineeService traineeService;
    
    public TraineeController(TraineeService traineeService) {
        this.traineeService = traineeService;
    }

    @PostMapping("/add")
    public ResponseEntity<Response> addTrainee( @RequestBody TraineeDto traineeDto) {
        Response response = traineeService.addTrainee(traineeDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/all-trainees")
    public ResponseEntity<Response> getAllTrainees() {
        Response response = traineeService.getAllTrainees();
        return ResponseEntity.status(response.getStatus()).body(response);
    }


    @GetMapping("/name/{name}")
    public ResponseEntity<Response> getTraineeByName(@PathVariable String name) {
        Response response = traineeService.getTraineeByName(name);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/associateId/{associateId}")
    public ResponseEntity<Response> getTraineeByAssociateId(@PathVariable String associateId) {
        Response response = traineeService.getTraineeByAssociateId(associateId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateTrainee(@PathVariable Long id, @RequestBody TraineeDto traineeDto) {
        Response response = traineeService.updateTrainee(id, traineeDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteTrainee(@PathVariable Long id) {
        Response response = traineeService.deleteTrainee(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Filtering endpoint: by domain, skills contains, and unassigned
    @GetMapping("/filter")
    public ResponseEntity<Response> listFiltered(
        @RequestParam(required = false) String domain,
        @RequestParam(required = false) String skills,
        @RequestParam(required = false, defaultValue = "false") boolean unassignedOnly
    ) {
        Response response = traineeService.listFiltered(domain, skills, unassignedOnly);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Assign multiple trainees to a cohort
    @PostMapping("/assign")
    public ResponseEntity<Response> assignToCohort(@RequestParam Long cohortId, @RequestBody java.util.List<Long> traineeIds) {
        Response response = traineeService.assignToCohort(traineeIds, cohortId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Bulk upsert trainees (create new or update existing by associateId/email)
    /**
     * Bulk upsert trainees.
     *
     * Matching rules:
     * - Tries traineeAssociateId first, then traineeEmail
     * - If no match: creates a new trainee
     * - If match and updateExisting=true: updates selected fields
     * - If match and updateExisting=false: skips the row
     *
     * @param trainees        list of TraineeDto (name, associateId, email; optional domainName, skills, cohortId)
     * @param updateExisting  when true (default), existing records will be updated; when false, existing records are not modified
     * @return Response containing a summary message with counts
     */
    @PostMapping("/bulk-upsert")
    public ResponseEntity<Response> bulkUpsert(
        @RequestBody java.util.List<TraineeDto> trainees,
        @RequestParam(name = "updateExisting", required = false, defaultValue = "true") Boolean updateExisting
    ) {
        Response response = traineeService.bulkUpsert(trainees, updateExisting);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}