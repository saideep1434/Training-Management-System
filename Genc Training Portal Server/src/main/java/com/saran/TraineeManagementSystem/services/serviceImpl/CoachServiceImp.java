package com.saran.TraineeManagementSystem.services.serviceImpl;

import com.saran.TraineeManagementSystem.Dtos.CoachDto;
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.models.Coach;
import com.saran.TraineeManagementSystem.Repositories.CoachRepository;
import com.saran.TraineeManagementSystem.services.CoachService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service

public class CoachServiceImp implements CoachService {

    private final CoachRepository coachRepository;
    private final ModelMapper modelMapper;

   
    public CoachServiceImp(CoachRepository coachRepository, ModelMapper modelMapper) {
        this.coachRepository = coachRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Response getAllCoaches() {
        List<Coach> coaches = coachRepository.findAll();
        if (coaches.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No coaches found.")
                    .build();
        }
        List<CoachDto> coachDtos = coaches.stream()
                .map(coach -> modelMapper.map(coach, CoachDto.class))
                .collect(Collectors.toList());
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("All coaches retrieved successfully")
                .coachs(coachDtos)
                .build();
    }

    @Override
    public Response getCoachByName(String name) {
        Optional<Coach> coach = coachRepository.findByCoachName(name);
        if (coach.isPresent()) {
            CoachDto coachDto = modelMapper.map(coach.get(), CoachDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Coach retrieved successfully")
                    .coach(coachDto)
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Coach with name " + name + " not found")
                    .build();
        }
    }

    @Override
    public Response getCoachByAssociateId(String associateId) {
        Optional<Coach> coach = coachRepository.findByCoachAssociateId(associateId);
        if (coach.isPresent()) {
            CoachDto coachDto = modelMapper.map(coach.get(), CoachDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Coach retrieved successfully")
                    .coach(coachDto)
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Coach with associate ID " + associateId + " not found")
                    .build();
        }
    }

    @Override
    public Response addCoach(CoachDto coachDto) {
        Optional<Coach> existingCoach = coachRepository.findByCoachName(coachDto.getCoachName());
        if (existingCoach.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value())
                    .message("Coach with name " + coachDto.getCoachName() + " already exists")
                    .build();
        }
        Coach coach = modelMapper.map(coachDto, Coach.class);
        coachRepository.save(coach);
        return Response.builder()
                .status(HttpStatus.CREATED.value())
                .message("Coach added successfully")
                .build();
    }

    @Override
    public Response updateCoach(Long id, CoachDto coachDto) {
        Optional<Coach> existingCoach = coachRepository.findById(id);
        if (existingCoach.isPresent()) {
            Coach coach = modelMapper.map(coachDto, Coach.class);
            coach.setCoachId(id); // Ensure the ID is set for the update
            coachRepository.save(coach);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Coach updated successfully")
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Coach with ID " + id + " not found")
                    .build();
        }
    }

    @Override
    public Response deleteCoach(Long id) {
        Optional<Coach> existingCoach = coachRepository.findById(id);
        if (existingCoach.isPresent()) {
            coachRepository.deleteById(id);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Coach deleted successfully")
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Coach with ID " + id + " not found")
                    .build();
        }
    }
}

