package com.saran.TraineeManagementSystem.Controllers; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.RegisterAssociateDto;
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.BhTrainerDto;
import com.saran.TraineeManagementSystem.models.UserRoles;
import com.saran.TraineeManagementSystem.services.AdminService;
import com.saran.TraineeManagementSystem.services.BHTrainerService;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bh-trainers")
public class BHTrainerController {

    private final BHTrainerService bhTrainerService;
    
    private final AdminService adminService;
    

    public BHTrainerController(BHTrainerService bhTrainerService, AdminService adminService) {
		super();
		this.bhTrainerService = bhTrainerService;
		this.adminService = adminService;
	}

	// POST /api/bh-trainers/add
    // Create a new BHTrainer
    @PostMapping("/add")
    public ResponseEntity<Response> addBHTrainer(@Valid @RequestBody BhTrainerDto bhTrainerDto) {
//        Response response = bhTrainerService.addBHTrainer(bhTrainerDto);
//        return ResponseEntity.status(response.getStatus()).body(response);
    	RegisterAssociateDto associateDto = new RegisterAssociateDto();
    	associateDto.setAssociateId(bhTrainerDto.getBhTrainerAssociateId());
    	associateDto.setAssociateName(bhTrainerDto.getBhTrainerName());
    	associateDto.setAssociateEmail(bhTrainerDto.getBhTrainerEmail());
    	associateDto.setRole(UserRoles.BH_TRAINER);
    	
        
        Response response = adminService.addAssociate(associateDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/bh-trainers/all-bh-trainers
    // Get all BHTrainers
    @GetMapping("/all-bh-trainers")
    public ResponseEntity<Response> getAllBHTrainers() {
        Response response = bhTrainerService.getAllBHTrainers();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/bh-trainers/{id}
    // Get a BHTrainer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Response> getBHTrainerById(@PathVariable Long id) {
        Response response = bhTrainerService.getBHTrainerById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/bh-trainers/name/{name}
    // Get a BHTrainer by name
    @GetMapping("/name/{name}")
    public ResponseEntity<Response> getBHTrainerByName(@PathVariable String name) {
        Response response = bhTrainerService.getBHTrainerByName(name);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/bh-trainers/associateId/{associateId}
    // Get a BHTrainer by Associate ID
    @GetMapping("/associateId/{associateId}")
    public ResponseEntity<Response> getBHTrainerByAssociateId(@PathVariable String associateId) {
        Response response = bhTrainerService.getBHTrainerByAssociateId(associateId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/bh-trainers/email/{email}
    // Get a BHTrainer by Email
    @GetMapping("/email/{email}")
    public ResponseEntity<Response> getBHTrainerByEmail(@PathVariable String email) {
        Response response = bhTrainerService.getBHTrainerByEmail(email);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // PUT /api/bh-trainers/update/{id}
    // Update a BHTrainer by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateBHTrainer(@PathVariable Long id, @Valid @RequestBody BhTrainerDto bhTrainerDto) {
        Response response = bhTrainerService.updateBHTrainer(id, bhTrainerDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // DELETE /api/bh-trainers/delete/{id}
    // Delete a BHTrainer by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteBHTrainer(@PathVariable Long id) {
        Response response = bhTrainerService.deleteBHTrainer(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}