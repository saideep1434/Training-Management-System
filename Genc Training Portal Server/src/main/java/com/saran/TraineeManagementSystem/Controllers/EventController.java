package com.saran.TraineeManagementSystem.Controllers;

import com.saran.TraineeManagementSystem.Dtos.EventDTO;
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.services.EventService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {


    private final EventService eventService;

    public EventController(EventService eventService) { this.eventService = eventService; }

    // 🔹 Get all events
    @GetMapping("/all")
    public ResponseEntity<Response> getAllEvents() {
        Response response = eventService.getAllEvents();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Response> getEventById(@PathVariable Long id) {
        Response response = eventService.getEventById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Get events by Cohort ID
    @GetMapping("/cohort/{cohortId}")
    public ResponseEntity<Response> getEventsByCohort(@PathVariable Long cohortId) {
        Response response = eventService.getEventsByCohort(cohortId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Get events by Creator Associate ID
    @GetMapping("/creator/{associateId}")
    public ResponseEntity<Response> getEventsByCreator(@PathVariable String associateId) {
        Response response = eventService.getEventsByCreator(associateId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Get events by Type (Enum/String)
    @GetMapping("/type/{type}")
    public ResponseEntity<Response> getEventsByType(@PathVariable String type) {
        Response response = eventService.getEventsByType(type);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Get events by Date
    @GetMapping("/date/{date}")
    public ResponseEntity<Response> getEventsByDate(@PathVariable String date) {
        Response response = eventService.getEventByDate(date);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Get events by Description (search text)
    @GetMapping("/description/{description}")
    public ResponseEntity<Response> getEventsByDescription(@PathVariable String description) {
        Response response = eventService.getEventsByDescription(description);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Get events by Start Hour
    @GetMapping("/start-hour/{startHour}")
    public ResponseEntity<Response> getEventsByStartHour(@PathVariable int startHour) {
        Response response = eventService.getEventsByStartHour(startHour);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Get events by End Hour
    @GetMapping("/end-hour/{endHour}")
    public ResponseEntity<Response> getEventsByEndHour(@PathVariable int endHour) {
        Response response = eventService.getEventsByEndHour(endHour);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Add event
    @PostMapping("/add")
    public ResponseEntity<Response> addEvent(@Valid @RequestBody EventDTO eventDTO) {
        Response response = eventService.addEvent(eventDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Update event
    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateEvent(@PathVariable Long id,
                                                @Valid @RequestBody EventDTO eventDTO) {
        Response response = eventService.updateEvent(id, eventDTO);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // 🔹 Delete event
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteEvent(@PathVariable Long id) {
        Response response = eventService.deleteEvent(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
