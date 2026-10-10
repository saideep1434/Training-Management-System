package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.HireTypeDto;
import com.saran.TraineeManagementSystem.services.HireTypeService;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hire-type") // Base URL for HireType operations
public class HireTypeController {

    private final HireTypeService hireTypeService;

    public HireTypeController(HireTypeService hireTypeService) {
        this.hireTypeService = hireTypeService;
    }
    
    @PostMapping("/add")
    public ResponseEntity<Response> addHireType(@Valid @RequestBody HireTypeDto hireTypeDto) {
        Response response = hireTypeService.addHireType(hireTypeDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

 
    @GetMapping("/all-hire-types")
    public ResponseEntity<Response> getAllHireTypes() {
        Response response = hireTypeService.getAllHireTypes();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

   
    @GetMapping("/{id}")
    public ResponseEntity<Response> getHireTypeById(@PathVariable("id") Long id) {
        Response response = hireTypeService.getHireTypeById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }


    @GetMapping("/type/{type}")
    public ResponseEntity<Response> getHireTypeByType(@PathVariable String type) {
        Response response = hireTypeService.getHireTypeByType(type);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

   
    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateHireType(@PathVariable Long id, @Valid @RequestBody HireTypeDto hireTypeDto) {
        Response response = hireTypeService.updateHireType(id, hireTypeDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

  
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteHireType(@PathVariable Long id) {
        Response response = hireTypeService.deleteHireType(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}