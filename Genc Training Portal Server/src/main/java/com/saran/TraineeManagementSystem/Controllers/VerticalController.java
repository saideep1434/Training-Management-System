package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.VerticalDto;
import com.saran.TraineeManagementSystem.services.VerticalService;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verticals")
public class VerticalController {

    private final VerticalService verticalService;
    
    public VerticalController(VerticalService verticalService) {
        this.verticalService = verticalService;
    }

    @PostMapping("/add")
    public ResponseEntity<Response> addVertical(@Valid @RequestBody VerticalDto verticalDto) {
        Response response = verticalService.addVertical(verticalDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }


    @GetMapping("/all-verticals")
    public ResponseEntity<Response> getAllVerticals() {
        Response response = verticalService.getAllVerticals();
        return ResponseEntity.status(response.getStatus()).body(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Response> getVerticalById(@PathVariable("id") Long id) {
        Response response = verticalService.getVerticalById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }


    @GetMapping("/name/{name}")
    public ResponseEntity<Response> getVerticalByName(@PathVariable String name) {
        Response response = verticalService.getVerticalByName(name);
        return ResponseEntity.status(response.getStatus()).body(response);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateVertical(@PathVariable Long id, @Valid @RequestBody VerticalDto verticalDto) {
        Response response = verticalService.updateVertical(id, verticalDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteVertical(@PathVariable Long id) {
        Response response = verticalService.deleteVertical(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}