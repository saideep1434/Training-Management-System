package com.saran.TraineeManagementSystem.Repositories; // Adjust package if different

import com.saran.TraineeManagementSystem.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    // Find a location by its name (assuming location name should be unique)
    Optional<Location> findByLocation(String locationName);

    // Find all locations that partially match a name (if needed for search)
     List<Location> findByLocationContainingIgnoreCase(String locationName);
}