package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.models.TrainerConnect;
import java.util.List;
import java.util.Optional;

public interface TrainerConnectService {

    TrainerConnect saveTrainerConnect(TrainerConnect trainerConnect);

    Optional<TrainerConnect> getTrainerConnectById(Long id);

    List<TrainerConnect> getAllTrainerConnects();

    TrainerConnect updateTrainerConnect(Long id, TrainerConnect trainerConnect);

    void deleteTrainerConnect(Long id);
}
