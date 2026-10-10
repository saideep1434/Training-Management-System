
 
package com.saran.TraineeManagementSystem.Repositories;
 
import com.saran.TraineeManagementSystem.models.RegisterAssociate;
import com.saran.TraineeManagementSystem.models.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import java.util.Optional;
 
@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByAssociate(RegisterAssociate associate);
    Optional<VerificationToken> findByToken(String token);
    void deleteByAssociate(RegisterAssociate associate); // For cleaning up old tokens
}
 
 