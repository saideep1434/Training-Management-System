package com.saran.TraineeManagementSystem.services.serviceImpl;


import com.saran.TraineeManagementSystem.models.TrainerConnect;
import com.saran.TraineeManagementSystem.Repositories.TrainerConnectRepository;
import com.saran.TraineeManagementSystem.services.TrainerConnectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrainerConnectServiceImpl implements TrainerConnectService {

    @Autowired
    private TrainerConnectRepository trainerConnectRepository;

    @Override
    public TrainerConnect saveTrainerConnect(TrainerConnect trainerConnect) {
        return trainerConnectRepository.save(trainerConnect);
    }

    @Override
    public Optional<TrainerConnect> getTrainerConnectById(Long id) {
        return trainerConnectRepository.findById(id);
    }

    @Override
    public List<TrainerConnect> getAllTrainerConnects() {
        return trainerConnectRepository.findAll();
    }

    @Override
    public TrainerConnect updateTrainerConnect(Long id, TrainerConnect trainerConnect) {
        Optional<TrainerConnect> existing = trainerConnectRepository.findById(id);
        if(existing.isPresent()) {
            TrainerConnect toUpdate = existing.get();
            toUpdate.updateFrom(trainerConnect);  // Using the model’s update method
            return trainerConnectRepository.save(toUpdate);
        }
        return null; // or throw exception
    }

    @Override
    public void deleteTrainerConnect(Long id) {
        trainerConnectRepository.deleteById(id);
    }
}

