package com.saran.TraineeManagementSystem.services.serviceImpl;

import com.saran.TraineeManagementSystem.Dtos.EventDTO;
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Repositories.EventRepository;
import com.saran.TraineeManagementSystem.models.Event;
import com.saran.TraineeManagementSystem.services.EventService;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final ModelMapper modelMapper;

    public EventServiceImpl(EventRepository eventRepository, ModelMapper modelMapper) {
        this.eventRepository = eventRepository;
        this.modelMapper = modelMapper;
    }

    private boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        for (GrantedAuthority ga : auth.getAuthorities()) {
            if (ga.getAuthority().equals(role)) return true;
        }
        return false;
    }

    private boolean canManageEventType(Event.EventType type) {
        // Coach can add any kind of event
        if (hasRole("ROLE_COACH")) return true;

        // BH Trainer can add only the BH_TRAINER_CONNECT
        if (hasRole("ROLE_BH_TRAINER")) {
            return type == Event.EventType.BH_TRAINER_CONNECT;
        }

        // Technical Trainer can add TRAINER_CONNECT, MEETING, PROJECT
        if (hasRole("ROLE_TECHNICAL_TRAINER")) {
            return type == Event.EventType.TRAINER_CONNECT
                || type == Event.EventType.MEETING
                || type == Event.EventType.PROJECT;
        }

        // Any other role cannot add/manage events
        return false;
    }

    private Event.EventType parseEventTypeSafe(String rawType) {
        if (rawType == null) return null;
        // Normalize: trim, uppercase, replace all non-alnum with single underscore, collapse repeats
        String normalized = rawType.trim().toUpperCase().replaceAll("[^A-Z0-9]+", "_");
        // Remove leading/trailing underscores if any
        normalized = normalized.replaceAll("^_+|_+$", "");
        // Backward-compat synonyms/migrations
        if ("WORKSHOP".equals(normalized)) {
            normalized = "COACH_CONNECT"; // legacy value mapped to closest new type
        }
        if ("BHTRAINER_CONNECT".equals(normalized)) {
            normalized = "BH_TRAINER_CONNECT";
        }
        return Event.EventType.valueOf(normalized);
    }

    private List<EventDTO> mapToDTOList(List<Event> events) {
        return events.stream()
                .map(event -> modelMapper.map(event, EventDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Response getAllEvents() {
        List<Event> events = eventRepository.findAll();
        if (events.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No events found.")
                    .build();
        }
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("All events retrieved successfully")
                .events(mapToDTOList(events))
                .build();
    }

    @Override
    public Response getEventById(Long id) {
        return eventRepository.findById(id)
                .map(event -> Response.builder()
                        .status(HttpStatus.OK.value())
                        .message("Event retrieved successfully")
                        .event(modelMapper.map(event, EventDTO.class))
                        .build())
                .orElse(Response.builder()
                        .status(HttpStatus.NOT_FOUND.value())
                        .message("Event with ID " + id + " not found")
                        .build());
    }

    @Override
    public Response getEventsByCohort(Long cohortId) {
        List<Event> events = eventRepository.findByCohortId(cohortId);
    // Always return 200 with an array (possibly empty) so clients can safely render
    return Response.builder()
        .status(HttpStatus.OK.value())
        .message((events.isEmpty() ? "No events found" : "Events retrieved successfully") + " for Cohort ID " + cohortId)
        .events(mapToDTOList(events))
        .build();
    }

    @Override
    public Response getEventsByCreator(String associateId) {
        List<Event> events = eventRepository.findByEventCreatorAssociateId(associateId);
        if (events.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No events found for creator " + associateId)
                    .build();
        }
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Events retrieved successfully for creator " + associateId)
                .events(mapToDTOList(events))
                .build();
    }

    @Override
    public Response getEventsByType(String type) {
        try {
            Event.EventType enumType = parseEventTypeSafe(type);
            List<Event> events = eventRepository.findByType(enumType);
            if (events.isEmpty()) {
                return Response.builder()
                        .status(HttpStatus.NOT_FOUND.value())
                        .message("No events found with type " + enumType.name())
                        .build();
            }
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Events retrieved successfully with type " + enumType.name())
                    .events(mapToDTOList(events))
                    .build();
        } catch (IllegalArgumentException ex) {
            return Response.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Invalid event type: " + type)
                    .build();
        }
    }

    @Override
    public Response getEventByDate(String date) {
        Date sqlDate = Date.valueOf(date);
        List<Event> events = eventRepository.findByDate(sqlDate);
        if (events.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No events found on " + date)
                    .build();
        }
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Events retrieved successfully for date " + date)
                .events(mapToDTOList(events))
                .build();
    }

    @Override
    public Response getEventsByDescription(String description) {
        List<Event> events = eventRepository.findByDescriptionContainingIgnoreCase(description);
        if (events.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No events found with description containing: " + description)
                    .build();
        }
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Events retrieved successfully with description containing: " + description)
                .events(mapToDTOList(events))
                .build();
    }

    @Override
    public Response getEventsByStartHour(int startHour) {
        List<Event> events = eventRepository.findByStartHour(startHour);
        if (events.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No events found with startHour " + startHour)
                    .build();
        }
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Events retrieved successfully with startHour " + startHour)
                .events(mapToDTOList(events))
                .build();
    }

    @Override
    public Response getEventsByEndHour(int endHour) {
        List<Event> events = eventRepository.findByEndHour(endHour);
        if (events.isEmpty()) {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("No events found with endHour " + endHour)
                    .build();
        }
        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Events retrieved successfully with endHour " + endHour)
                .events(mapToDTOList(events))
                .build();
    }

    @Override
    public Response addEvent(EventDTO eventDTO) {
        // Build the Event explicitly to avoid ModelMapper conversion issues
        Event event = new Event();
        // Required fields
        event.setCohortId(eventDTO.getCohortId());
        event.setEventCreatorAssociateId(eventDTO.getEventCreatorAssociateId());
        // Convert type string to enum
        if (eventDTO.getType() != null) {
            try {
                Event.EventType type = parseEventTypeSafe(eventDTO.getType());
                // Authorization: verify current user's roles allow creating this event type
                if (!canManageEventType(type)) {
                    return Response.builder()
                            .status(HttpStatus.FORBIDDEN.value())
                            .message("You are not allowed to create events of type: " + type.name())
                            .build();
                }
                event.setType(type);
            } catch (IllegalArgumentException ex) {
                return Response.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message("Invalid event type: " + eventDTO.getType())
                        .build();
            }
        }
        // Convert date string (yyyy-MM-dd) to SQL Date
        if (eventDTO.getDate() != null) {
            try {
                event.setDate(Date.valueOf(eventDTO.getDate()));
            } catch (IllegalArgumentException ex) {
                return Response.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message("Invalid date format, expected yyyy-MM-dd: " + eventDTO.getDate())
                        .build();
            }
        }
        // Other fields
        event.setDescription(eventDTO.getDescription());
        event.setStartHour(eventDTO.getStartHour());
        event.setEndHour(eventDTO.getEndHour());
        eventRepository.save(event);
        return Response.builder()
                .status(HttpStatus.CREATED.value())
                .message("Event added successfully")
                .event(modelMapper.map(event, EventDTO.class))
                .build();
    }

    @Override
    public Response updateEvent(Long id, EventDTO eventDTO) {
        Optional<Event> existingEvent = eventRepository.findById(id);
        if (existingEvent.isPresent()) {
            Event event = existingEvent.get();
            // Update mutable fields explicitly
            if (eventDTO.getCohortId() != null) {
                event.setCohortId(eventDTO.getCohortId());
            }
            if (eventDTO.getEventCreatorAssociateId() != null) {
                event.setEventCreatorAssociateId(eventDTO.getEventCreatorAssociateId());
            }
            if (eventDTO.getType() != null) {
                try {
                    Event.EventType newType = parseEventTypeSafe(eventDTO.getType());
                    // Authorization: verify user is allowed to set this type
                    if (!canManageEventType(newType)) {
                        return Response.builder()
                                .status(HttpStatus.FORBIDDEN.value())
                                .message("You are not allowed to update event to type: " + newType.name())
                                .build();
                    }
                    event.setType(newType);
                } catch (IllegalArgumentException ex) {
                    return Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message("Invalid event type: " + eventDTO.getType())
                            .build();
                }
            }
            if (eventDTO.getDate() != null) {
                try {
                    event.setDate(Date.valueOf(eventDTO.getDate()));
                } catch (IllegalArgumentException ex) {
                    return Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message("Invalid date format, expected yyyy-MM-dd: " + eventDTO.getDate())
                            .build();
                }
            }
            event.setDescription(eventDTO.getDescription());
            event.setStartHour(eventDTO.getStartHour());
            event.setEndHour(eventDTO.getEndHour());
            eventRepository.save(event);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Event updated successfully")
                    .event(modelMapper.map(event, EventDTO.class))
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Event with ID " + id + " not found")
                    .build();
        }
    }

    @Override
    public Response deleteEvent(Long id) {
        Optional<Event> existingEvent = eventRepository.findById(id);
        if (existingEvent.isPresent()) {
            eventRepository.deleteById(id);
            return Response.builder()
                    .status(HttpStatus.OK.value())
                    .message("Event deleted successfully")
                    .build();
        } else {
            return Response.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("Event with ID " + id + " not found")
                    .build();
        }
    }
}
