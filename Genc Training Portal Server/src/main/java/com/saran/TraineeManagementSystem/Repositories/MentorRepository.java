

package com.saran.TraineeManagementSystem.Repositories; // Adjust package if different

import com.saran.TraineeManagementSystem.models.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<Mentor, Long> {

    Optional<Mentor> findByMentorName(String mentorName);

    Optional<Mentor> findByMentorAssociateId(String mentorAssociateId);

    Optional<Mentor> findByMentorEmail(String mentorEmail);
    
    void deleteByMentorAssociateId(String associateId);
}