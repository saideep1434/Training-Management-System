package com.saran.TraineeManagementSystem.services.serviceImpl; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.MentorDto;
import com.saran.TraineeManagementSystem.models.Mentor;
import com.saran.TraineeManagementSystem.Repositories.*;
import com.saran.TraineeManagementSystem.services.MentorService; // Adjust package if different

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MentorServiceImpl implements MentorService {

    private final MentorRepository mentorRepository;
    private final ModelMapper modelMapper;
    
    public MentorServiceImpl(MentorRepository mentorRepository, ModelMapper modelMapper) {
        this.mentorRepository = mentorRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Response addMentor(MentorDto mentorDto) {
        // Check for duplicate Associate ID or Email before adding
        if (mentorRepository.findByMentorAssociateId(mentorDto.getMentorAssociateId()).isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value()) // 409 Conflict
                    .message("Mentor with Associate ID '" + mentorDto.getMentorAssociateId() + "' already exists.")
                    .build();
        }
        if (mentorRepository.findByMentorEmail(mentorDto.getMentorEmail()).isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value()) // 409 Conflict
                    .message("Mentor with email '" + mentorDto.getMentorEmail() + "' already exists.")
                    .build();
        }

        Mentor mentor = modelMapper.map(mentorDto, Mentor.class);
        Mentor savedMentor = mentorRepository.save(mentor);

        return Response.builder()
                .status(HttpStatus.CREATED.value()) // 201 Created
                .message("Mentor added successfully.")
                .mentor(modelMapper.map(savedMentor, MentorDto.class)) // Return the saved DTO
                .build();
    }

    @Override
    public Response getAllMentors() {
        List<Mentor> mentors = mentorRepository.findAll();
        if (mentors.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("No Mentors found.")
                    .build();
        }
        List<MentorDto> mentorDtos = mentors.stream()
                .map(mentor -> modelMapper.map(mentor, MentorDto.class))
                .collect(Collectors.toList());

        return Response.builder()
                .status(HttpStatus.OK.value()) // 200 OK
                .message("All Mentors retrieved successfully.")
                .mentorList(mentorDtos) // Returning the list of DTOs
                .build();
    }

    @Override
    public Response getMentorById(Long id) {
        Optional<Mentor> mentorOptional = mentorRepository.findById(id);
        if (mentorOptional.isPresent()) {
            MentorDto mentorDto = modelMapper.map(mentorOptional.get(), MentorDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Mentor retrieved successfully by ID.")
                    .mentor(mentorDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Mentor with ID " + id + " not found.")
                    .build();
        }
    }

    @Override
    public Response getMentorByName(String name) {
        // Assuming findByMentorName returns Optional<Mentor>
        Optional<Mentor> mentorOptional = mentorRepository.findByMentorName(name);
        if (mentorOptional.isPresent()) {
            MentorDto mentorDto = modelMapper.map(mentorOptional.get(), MentorDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Mentor retrieved successfully by name.")
                    .mentor(mentorDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Mentor with name '" + name + "' not found.")
                    .build();
        }
    }

    @Override
    public Response getMentorByAssociateId(String associateId) {
        Optional<Mentor> mentorOptional = mentorRepository.findByMentorAssociateId(associateId);
        if (mentorOptional.isPresent()) {
            MentorDto mentorDto = modelMapper.map(mentorOptional.get(), MentorDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Mentor retrieved successfully by Associate ID.")
                    .mentor(mentorDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Mentor with Associate ID '" + associateId + "' not found.")
                    .build();
        }
    }

    @Override
    public Response getMentorByEmail(String email) {
        Optional<Mentor> mentorOptional = mentorRepository.findByMentorEmail(email);
        if (mentorOptional.isPresent()) {
            MentorDto mentorDto = modelMapper.map(mentorOptional.get(), MentorDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Mentor retrieved successfully by Email.")
                    .mentor(mentorDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Mentor with Email '" + email + "' not found.")
                    .build();
        }
    }

    @Override
    public Response updateMentor(Long id, MentorDto mentorDto) {
        Optional<Mentor> existingMentorOptional = mentorRepository.findById(id);
        if (existingMentorOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Mentor with ID " + id + " not found for update.")
                    .build();
        }
        Mentor existingMentor = existingMentorOptional.get();

        // Check for duplicate Associate ID or Email if they are being changed to an existing one (excluding current mentor)
        if (!existingMentor.getMentorAssociateId().equals(mentorDto.getMentorAssociateId())) {
            if (mentorRepository.findByMentorAssociateId(mentorDto.getMentorAssociateId()).isPresent()) {
                return Response.builder()
                        .status(HttpStatus.CONFLICT.value())
                        .message("Associate ID '" + mentorDto.getMentorAssociateId() + "' already exists for another Mentor.")
                        .build();
            }
        }
        if (!existingMentor.getMentorEmail().equals(mentorDto.getMentorEmail())) {
            if (mentorRepository.findByMentorEmail(mentorDto.getMentorEmail()).isPresent()) {
                return Response.builder()
                        .status(HttpStatus.CONFLICT.value())
                        .message("Email '" + mentorDto.getMentorEmail() + "' already exists for another Mentor.")
                        .build();
            }
        }

        // Update existing entity properties from DTO
        modelMapper.map(mentorDto, existingMentor);
        existingMentor.setMentorId(id); // Ensure the ID from the path is retained

        Mentor updatedMentor = mentorRepository.save(existingMentor);

        return Response.builder()
                .status(HttpStatus.OK.value()) // 200 OK
                .message("Mentor updated successfully.")
                .mentor(modelMapper.map(updatedMentor, MentorDto.class)) // Return the updated DTO
                .build();
    }

    @Override
    public Response deleteMentor(Long id) {
        Optional<Mentor> existingMentorOptional = mentorRepository.findById(id);
        if (existingMentorOptional.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Mentor with ID " + id + " not found for deletion.")
                    .build();
        }
        mentorRepository.deleteById(id);
        return Response.builder()
                .status(HttpStatus.OK.value()) // 204 No Content
                .message("Mentor deleted successfully.")
                .build();
    }
}