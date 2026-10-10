package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.*;
import com.saran.TraineeManagementSystem.models.Domain;
import com.saran.TraineeManagementSystem.services.DomainService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/domain")
public class DomainController {

    private final DomainService domainService;

    public DomainController(DomainService domainService) {
        this.domainService = domainService;
    }
    
    @PostMapping("/add-domain")
    public ResponseEntity<Response> addDomain(@RequestBody DomainDto domainDto) {
        Response response = domainService.addDomain(domainDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/all-domains")
    public ResponseEntity<Response> getAllDomains() {
        Response response = domainService.getAllDomain();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/name/{domainName}")
    public ResponseEntity<Response> getDomainByName(@PathVariable String domainName) {
        Response response = domainService.getDomainByName(domainName);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/update/{domainId}")
    public ResponseEntity<Response> updateDomain(@PathVariable Long domainId, @RequestBody DomainDto domainName) {
        Response response = domainService.updateDomain(domainId, domainName);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    @PutMapping("/updateByName/{domainName}") // Explicitly distinguish this path
    public ResponseEntity<Response> updateDomainByName(
            @PathVariable("domainName") String domainIdentifier, // This is the CURRENT name of the domain
            @RequestBody DomainDto updatedDomainDto) {          // This DTO contains the NEW name and other updates
        Response response = domainService.updateDomainByName(domainIdentifier, updatedDomainDto);
        HttpStatus httpStatus = HttpStatus.valueOf(response.getStatus());
        return ResponseEntity.status(httpStatus).body(response);
    }

    @DeleteMapping("/delete/{domainId}")
    public ResponseEntity<Response> deleteDomain(@PathVariable Long domainId) {
        Response response = domainService.deleteDomain(domainId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
    @DeleteMapping("/deleteByName/{domainName}")
    public ResponseEntity<Response> deleteDomain(@PathVariable String domainName) {
        Response response = domainService.deleteDomainByName(domainName);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
