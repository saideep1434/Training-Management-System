package com.saran.TraineeManagementSystem.models;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class EventTypeConverter implements AttributeConverter<Event.EventType, String> {

    @Override
    public String convertToDatabaseColumn(Event.EventType attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public Event.EventType convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        // Normalize to ENUM style
        String normalized = dbData.trim().toUpperCase().replaceAll("[^A-Z0-9]+", "_");
        normalized = normalized.replaceAll("^_+|_+$", "");

        // Backward compatibility / synonyms
        if ("WORKSHOP".equals(normalized)) {
            normalized = "COACH_CONNECT"; // migrate legacy 'WORKSHOP' to 'COACH_CONNECT'
        }
        if ("BHTRAINER_CONNECT".equals(normalized)) {
            normalized = "BH_TRAINER_CONNECT"; // tolerate missing underscore
        }

        return Event.EventType.valueOf(normalized);
    }
}
