package com.saran.TraineeManagementSystem.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saran.TraineeManagementSystem.models.Calendar;

public interface CalendarRepository extends JpaRepository<Calendar, Long>{
	
	
}
