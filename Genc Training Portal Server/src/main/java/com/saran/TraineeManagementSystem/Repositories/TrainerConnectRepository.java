package com.saran.TraineeManagementSystem.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saran.TraineeManagementSystem.models.TrainerConnect;


import com.saran.TraineeManagementSystem.models.TrainerConnect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainerConnectRepository extends JpaRepository<TrainerConnect, Long> {

}
