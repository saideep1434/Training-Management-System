package com.saran.TraineeManagementSystem.Repositories;

import com.saran.TraineeManagementSystem.models.Domain;
import com.saran.TraineeManagementSystem.models.Vertical;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerticalRepository extends JpaRepository<Vertical, Long> {

    Optional<Vertical> findByVerticalName(String verticalName);

    // This method is still useful to fetch all verticals for a domain (by its ID)
    List<Vertical> findByDomain_DomainId(Long domainId);

    // This method now checks uniqueness by vertical name and the associated Domain object
    Optional<Vertical> findByVerticalNameAndDomain(String verticalName, Domain domain);
}