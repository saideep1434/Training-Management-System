package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.ServiceLineDto;
import com.saran.TraineeManagementSystem.models.ServiceLine;
import com.saran.TraineeManagementSystem.services.ServiceLineService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/service-line")
public class ServiceLineController {

    private final ServiceLineService serviceLineService;
    
    public ServiceLineController(ServiceLineService serviceLineService) {
        this.serviceLineService = serviceLineService;
    }

    @PostMapping("/add")
    public ResponseEntity<Response> addServiceLine(@RequestBody ServiceLineDto serviceLineDto) {
        Response response = serviceLineService.addServiceLine(serviceLineDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<Response> getAllServiceLines() {
        Response response = serviceLineService.getAllServiceLine();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/update/{serviceLineId}")
    public ResponseEntity<Response> updateServiceLine(@PathVariable Long serviceLineId, @RequestBody ServiceLineDto serviceLineDto) {
        Response response = serviceLineService.updateServiceLine(serviceLineId, serviceLineDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    @PutMapping("/updateByName/{trackName}") // New distinct path for update by name
    public ResponseEntity<Response> updateServiceLine(
            @PathVariable("trackName") String trackName,
            @Valid @RequestBody ServiceLineDto serviceLineDto) {
        Response response = serviceLineService.updateServiceLine(trackName, serviceLineDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    @DeleteMapping("/deleteByName/{trackName}") // New distinct path for delete by name
    public ResponseEntity<Response> deleteServiceLine(@PathVariable("trackName") String trackName) {
        Response response = serviceLineService.deleteServiceLine(trackName);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    @DeleteMapping("/delete/{serviceLineId}")
    public ResponseEntity<Response> deleteServiceLine(@PathVariable Long serviceLineId) {
        Response response = serviceLineService.deleteServiceLine(serviceLineId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}

