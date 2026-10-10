package com.saran.TraineeManagementSystem.Controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.saran.TraineeManagementSystem.models.TrainerConnect;
import com.saran.TraineeManagementSystem.services.TrainerConnectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/event")
public class TrainerConnectController {

    @Autowired
    private TrainerConnectService trainerConnectService;

    @PostMapping
    public ResponseEntity<TrainerConnect> createTrainerConnect(@RequestBody TrainerConnect trainerConnect) {
        TrainerConnect saved = trainerConnectService.saveTrainerConnect(trainerConnect);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainerConnect> getTrainerConnectById(@PathVariable Long id) {
        Optional<TrainerConnect> result = trainerConnectService.getTrainerConnectById(id);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<TrainerConnect>> getAllTrainerConnects() {
        return ResponseEntity.ok(trainerConnectService.getAllTrainerConnects());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainerConnect> updateTrainerConnect(@PathVariable Long id, @RequestBody TrainerConnect trainerConnect) {
        TrainerConnect updated = trainerConnectService.updateTrainerConnect(id, trainerConnect);
        if(updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainerConnect(@PathVariable Long id) {
        trainerConnectService.deleteTrainerConnect(id);
        return ResponseEntity.noContent().build();
    }
}

