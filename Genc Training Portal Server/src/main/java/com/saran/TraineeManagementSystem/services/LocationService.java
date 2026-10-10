package com.saran.TraineeManagementSystem.services; // Adjust package if different

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.LocationDto;

public interface LocationService {
    Response addLocation(LocationDto locationDto);
    Response getAllLocations();
    Response getLocationById(Long id);
    Response getLocationByName(String name);
    Response updateLocation(Long id, LocationDto locationDto);
    Response deleteLocation(Long id);
}