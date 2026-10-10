package com.saran.TraineeManagementSystem.services; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.MentorDto;

public interface MentorService {
    Response addMentor(MentorDto mentorDto);
    Response getAllMentors();
    Response getMentorById(Long id);
    Response getMentorByName(String name);
    Response getMentorByAssociateId(String associateId);
    Response getMentorByEmail(String email);
    Response updateMentor(Long id, MentorDto mentorDto);
    Response deleteMentor(Long id);
}