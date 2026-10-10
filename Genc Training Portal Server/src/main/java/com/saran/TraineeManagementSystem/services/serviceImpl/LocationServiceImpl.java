package com.saran.TraineeManagementSystem.services.serviceImpl; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.LocationDto;
import com.saran.TraineeManagementSystem.models.Location;
import com.saran.TraineeManagementSystem.Repositories.*;
import com.saran.TraineeManagementSystem.services.LocationService; // Adjust package if different

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service

public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final ModelMapper modelMapper;
    
    public LocationServiceImpl(LocationRepository locationRepository, ModelMapper modelMapper) {
        this.locationRepository = locationRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Response addLocation(LocationDto locationDto) {
        // Check for duplicate location name before adding
        Optional<Location> existingLocation = locationRepository.findByLocation(locationDto.getLocation());
        if (existingLocation.isPresent()) {
            return Response.builder()
                    .status(HttpStatus.CONFLICT.value()) // 409 Conflict
                    .message("Location with name '" + locationDto.getLocation() + "' already exists.")
                    .build();
        }

        Location location = modelMapper.map(locationDto, Location.class);
        Location savedLocation = locationRepository.save(location);

        return Response.builder()
                .status(HttpStatus.CREATED.value()) // 201 Created
                .message("Location added successfully.")
                //.location(modelMapper.map(savedLocation, LocationDto.class)) // Returning the saved DTO
                .build();
    }

    @Override
    public Response getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        if (locations.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("No locations found.")
                    .build();
        }
        List<LocationDto> locationDtos = locations.stream()
                .map(location -> modelMapper.map(location, LocationDto.class))
                .collect(Collectors.toList());

        return Response.builder()
                .status(HttpStatus.OK.value()) // 200 OK
                .message("All locations retrieved successfully.")
                .locationList(locationDtos) // Returning the list of DTOs
                .build();
    }

    @Override
    public Response getLocationById(Long id) {
        Optional<Location> locationOptional = locationRepository.findById(id);
        if (locationOptional.isPresent()) {
            LocationDto locationDto = modelMapper.map(locationOptional.get(), LocationDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Location retrieved successfully by ID.")
                    .location(locationDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Location with ID " + id + " not found.")
                    .build();
        }
    }

    @Override
    public Response getLocationByName(String name) {
        // Assuming findByLocationName returns Optional<Location>
        Optional<Location> locationOptional = locationRepository.findByLocation(name);
        if (locationOptional.isPresent()) {
            LocationDto locationDto = modelMapper.map(locationOptional.get(), LocationDto.class);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Location retrieved successfully by name.")
                    .location(locationDto) // Returning the single DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Location with name '" + name + "' not found.")
                    .build();
        }
    }

    @Override
    public Response updateLocation(Long id, LocationDto locationDto) {
        Optional<Location> existingLocationOptional = locationRepository.findById(id);
        if (existingLocationOptional.isPresent()) {
            Location existingLocation = existingLocationOptional.get();

            // Check if the new name conflicts with another existing location (excluding itself)
            Optional<Location> locationWithSameName = locationRepository.findByLocation(locationDto.getLocation());
            if (locationWithSameName.isPresent() && !locationWithSameName.get().getLocationId().equals(id)) {
                return Response.builder()
                        .status(HttpStatus.CONFLICT.value())
                        .message("Location with name '" + locationDto.getLocation() + "' already exists for another ID.")
                        .build();
            }

            // Update existing entity properties from DTO
            modelMapper.map(locationDto, existingLocation);
            // Ensure the ID from the path is retained
            existingLocation.setLocationId(id); // Important to ensure we update the correct record

            Location updatedLocation = locationRepository.save(existingLocation);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 200 OK
                    .message("Location updated successfully.")
                    .location(modelMapper.map(updatedLocation, LocationDto.class)) // Return the updated DTO
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Location with ID " + id + " not found for update.")
                    .build();
        }
    }

    @Override
    public Response deleteLocation(Long id) {
        Optional<Location> existingLocationOptional = locationRepository.findById(id);
        if (existingLocationOptional.isPresent()) {
            locationRepository.deleteById(id);
            return Response.builder()
                    .status(HttpStatus.OK.value()) // 204 No Content
                    .message("Location deleted successfully.")
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value()) // 404 Not Found
                    .message("Location with ID " + id + " not found for deletion.")
                    .build();
        }
    }
}