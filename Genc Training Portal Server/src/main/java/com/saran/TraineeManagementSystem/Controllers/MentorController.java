package com.saran.TraineeManagementSystem.Controllers; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.MentorDto;
import com.saran.TraineeManagementSystem.services.MentorService;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }
    // POST /api/mentors/add
    // Create a new Mentor
    @PostMapping("/add")
    public ResponseEntity<Response> addMentor(@Valid @RequestBody MentorDto mentorDto) {
        Response response = mentorService.addMentor(mentorDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/mentors/all-mentors
    // Get all Mentors
    @GetMapping("/all-mentors")
    public ResponseEntity<Response> getAllMentors() {
        Response response = mentorService.getAllMentors();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/mentors/{id}
    // Get a Mentor by ID
    @GetMapping("/{id}")
    public ResponseEntity<Response> getMentorById(@PathVariable("id") Long id) {
        Response response = mentorService.getMentorById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/mentors/name/{name}
    // Get a Mentor by name
    @GetMapping("/name/{name}")
    public ResponseEntity<Response> getMentorByName(@PathVariable String name) {
        Response response = mentorService.getMentorByName(name);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/mentors/associateId/{associateId}
    // Get a Mentor by Associate ID
    @GetMapping("/associateId/{associateId}")
    public ResponseEntity<Response> getMentorByAssociateId(@PathVariable String associateId) {
        Response response = mentorService.getMentorByAssociateId(associateId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/mentors/email/{email}
    // Get a Mentor by Email
    @GetMapping("/email/{email}")
    public ResponseEntity<Response> getMentorByEmail(@PathVariable String email) {
        Response response = mentorService.getMentorByEmail(email);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // PUT /api/mentors/update/{id}
    // Update a Mentor by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateMentor(@PathVariable Long id, @Valid @RequestBody MentorDto mentorDto) {
        Response response = mentorService.updateMentor(id, mentorDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // DELETE /api/mentors/delete/{id}
    // Delete a Mentor by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteMentor(@PathVariable Long id) {
        Response response = mentorService.deleteMentor(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}