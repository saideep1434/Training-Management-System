package com.saran.TraineeManagementSystem.Controllers; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.LocationDto;
import com.saran.TraineeManagementSystem.services.LocationService; // Adjust package if different

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid; // Import for validation

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/location") // Base URL for Location operations
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }
  
    @PostMapping("/add")
    public ResponseEntity<Response> addLocation(@Valid @RequestBody LocationDto locationDto) {
        Response response = locationService.addLocation(locationDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    
    @GetMapping("/all-locations")
    public ResponseEntity<Response> getAllLocations() {
        Response response = locationService.getAllLocations();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    
    @GetMapping("/location/{id}")
    public ResponseEntity<Response> getLocationById(@PathVariable("id") Long id) {
        Response response = locationService.getLocationById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

 
    @GetMapping("/name/{name}")
    public ResponseEntity<Response> getLocationByName(@PathVariable String name) {
        Response response = locationService.getLocationByName(name);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

  
    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateLocation(@PathVariable Long id, @Valid @RequestBody LocationDto locationDto) {
        Response response = locationService.updateLocation(id, locationDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteLocation(@PathVariable Long id) {
        Response response = locationService.deleteLocation(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}