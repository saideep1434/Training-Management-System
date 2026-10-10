package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.Dtos.EventDTO;
import com.saran.TraineeManagementSystem.Dtos.Response;

public interface EventService {

    Response getAllEvents();
    Response getEventById(Long id);

    Response getEventsByCohort(Long cohortId);
    Response getEventsByCreator(String associateId);
    Response getEventsByType(String type);
    Response getEventByDate(String date);
    Response getEventsByDescription(String description);
    Response getEventsByStartHour(int startHour);
    Response getEventsByEndHour(int endHour);

    Response addEvent(EventDTO eventDTO);
    Response updateEvent(Long id, EventDTO eventDTO);
    Response deleteEvent(Long id);
}
