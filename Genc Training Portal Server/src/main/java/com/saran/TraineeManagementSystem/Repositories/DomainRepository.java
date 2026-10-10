package com.saran.TraineeManagementSystem.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saran.TraineeManagementSystem.models.Domain;

public interface DomainRepository extends JpaRepository<Domain, Long>{

	Optional<Domain> findByDomainName(String domainName);

	void deleteByDomainName(String domainName);

}
