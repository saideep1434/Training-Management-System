package com.saran.TraineeManagementSystem.Controllers;
 
import com.saran.TraineeManagementSystem.Dtos.LearningPathBatchRequestDto;
import com.saran.TraineeManagementSystem.Dtos.LearningPathDayDetailDto; // Import for specific day update
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.services.LearningPathService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/api/learning-paths")
public class LearningPathController {
 
    private final LearningPathService learningPathService;
 
    public LearningPathController(LearningPathService learningPathService) {
        this.learningPathService = learningPathService;
    }
    
    @GetMapping("learningPath/{learningPathId}")
    public ResponseEntity<Response> getLearningPathById(@PathVariable Long learningPathId){
    	Response response = learningPathService.getLearningPathByLearningPathId(learningPathId);
    	return ResponseEntity.status(response.getStatus()).body(response);
    }
    
 
    @PostMapping("/add")
    public ResponseEntity<Response> createOrUpdateLearningPath(@Valid @RequestBody LearningPathBatchRequestDto requestDto) {
        Response response = learningPathService.createOrUpdateLearningPath(requestDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    @PutMapping("/update/{learningPathId}") // Use PUT for idempotence (updating an existing resource)
    public ResponseEntity<Response> updateLearningPathById(
            @PathVariable Long learningPathId,
            @Valid @RequestBody LearningPathBatchRequestDto requestDto) { // Assuming requestDto is still suitable
        // You'll need a new service method to handle this specific update logic
        Response response = learningPathService.updateLearningPathById(learningPathId, requestDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
  
   
    @GetMapping("/service-line/{serviceLineName}")
    public ResponseEntity<Response> getLearningPathByServiceLineName(@PathVariable String serviceLineName) {
        Response response = learningPathService.getLearningPathByServiceLineName(serviceLineName);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
 
    
    @PutMapping("/day-entry/{dayEntryId}") // Specific endpoint for updating a single day entry
    public ResponseEntity<Response> updateLearningPathDay(@PathVariable Long dayEntryId, @Valid @RequestBody LearningPathDayDetailDto dayDetailDto) {
        Response response = learningPathService.updateLearningPathDay(dayEntryId, dayDetailDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
 
    
    @DeleteMapping("/delete/service-line/{serviceLineName}")
    public ResponseEntity<Response> deleteLearningPathByServiceLine(@PathVariable String serviceLineName) {
        Response response = learningPathService.deleteLearningPathByServiceLine(serviceLineName);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    @GetMapping("/basic-info")
    public ResponseEntity<Response> getAllLearningPathIdentifiers() {
        Response response = learningPathService.getAllLearningPathsBasicInfo();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}