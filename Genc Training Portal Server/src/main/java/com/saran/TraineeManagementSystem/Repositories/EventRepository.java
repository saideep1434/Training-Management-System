package com.saran.TraineeManagementSystem.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.saran.TraineeManagementSystem.models.Event;

import java.sql.Date;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // By individual columns
    List<Event> findByDate(Date date);
    List<Event> findByType(Event.EventType type);
//    List<Event> findByName(String name);
//    List<Event> findByDescriptionContaining(String keyword); // useful for search
//    List<Event> findByLocation(String location);
//    List<Event> findByOrganizer(String organizer);
//
//    // Combinations (if needed)
//    List<Event> findByDateAndType(Date date, Event.EventType type);
//    List<Event> findByNameAndDate(String name, Date date);

    List<Event> findByCohortId(Long cohortId);
    List<Event> findByEventCreatorAssociateId(String associateId);

    List<Event> findByDescriptionContainingIgnoreCase(String description);

    List<Event> findByStartHour(int startHour);

    List<Event> findByEndHour(int endHour);
}
