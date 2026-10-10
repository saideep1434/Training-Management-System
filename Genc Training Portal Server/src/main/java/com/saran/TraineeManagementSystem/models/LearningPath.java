package com.saran.TraineeManagementSystem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne; // Assuming LearningPath is ONE per ServiceLine now
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;

import java.util.ArrayList;
import java.util.List;

//@Entity
//@Table(name = "learning_path")
//public class LearningPath {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long learningPathId;
//
//    @Column(nullable = false)
//    private Long durationWeeks;
//
//    @OneToOne
//    @JoinColumn(name = "service_line_id", referencedColumnName = "serviceLineId", unique = true, nullable = false)
//    private ServiceLine serviceLine;
//
//
//    @OneToMany(mappedBy = "learningPath", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
//    private List<LearningPathDayEntry> dayEntries = new ArrayList<>(); // Renamed for clarity
//
//    // --- Constructors ---
//    public LearningPath() {
//    }
//
//    public LearningPath(Long learningPathId, Long durationWeeks, ServiceLine serviceLine) {
//        this.learningPathId = learningPathId;
//        this.durationWeeks = durationWeeks;
//        this.serviceLine = serviceLine;
//    }
//
//    // --- Getters and Setters ---
//    public Long getLearningPathId() {
//        return learningPathId;
//    }
//
//    public void setLearningPathId(Long learningPathId) {
//        this.learningPathId = learningPathId;
//    }
//
//    public Long getDurationWeeks() {
//        return durationWeeks;
//    }
//
//    public void setDurationWeeks(Long durationWeeks) {
//        this.durationWeeks = durationWeeks;
//    }
//
//    public ServiceLine getServiceLine() {
//        return serviceLine;
//    }
//
//    public void setServiceLine(ServiceLine serviceLine) {
//        this.serviceLine = serviceLine;
//    }
//
//    public List<LearningPathDayEntry> getDayEntries() {
//        return dayEntries;
//    }
//
//    public void setDayEntries(List<LearningPathDayEntry> dayEntries) {
//        this.dayEntries = dayEntries;
//        // Maintain bidirectional consistency
//        if (dayEntries != null) {
//            for (LearningPathDayEntry entry : dayEntries) {
//                if (entry.getLearningPath() != this) {
//                    entry.setLearningPath(this);
//                }
//            }
//        }
//    }
//
//    public void addDayEntry(LearningPathDayEntry entry) {
//        if (entry != null) {
//            dayEntries.add(entry);
//            entry.setLearningPath(this);
//        }
//    }
//
//    public void removeDayEntry(LearningPathDayEntry entry) {
//        if (entry != null) {
//            dayEntries.remove(entry);
//            entry.setLearningPath(null); // Detach
//        }
//    }
//}
@Entity
@Table(name = "learning_path")
public class LearningPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long learningPathId;

    @Column(nullable = false)
    private Long durationWeeks;

    @OneToOne
    @JoinColumn(name = "service_line_id", referencedColumnName = "serviceLineId", unique = true, nullable = false)
    private ServiceLine serviceLine;

    @OneToMany(mappedBy = "learningPath", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LearningPathDayEntry> dayEntries = new ArrayList<>();

    // Constructors, getters, and other fields...

    public Long getLearningPathId() {
        return learningPathId;
    }

    public void setLearningPathId(Long learningPathId) {
        this.learningPathId = learningPathId;
    }

    public Long getDurationWeeks() {
        return durationWeeks;
    }

    public void setDurationWeeks(Long durationWeeks) {
        this.durationWeeks = durationWeeks;
    }

    public ServiceLine getServiceLine() {
        return serviceLine;
    }

    public void setServiceLine(ServiceLine serviceLine) {
        this.serviceLine = serviceLine;
    }

    public List<LearningPathDayEntry> getDayEntries() {
        return dayEntries;
    }

    // Do NOT expose setDayEntries() or only use it carefully during object creation

    // Add a new day entry and maintain bidirectional relationship
    public void addDayEntry(LearningPathDayEntry entry) {
        this.dayEntries.add(entry);
        entry.setLearningPath(this);
    }

    // Remove a day entry and detach
    public void removeDayEntry(LearningPathDayEntry entry) {
        this.dayEntries.remove(entry);
        entry.setLearningPath(null);
    }

    // Clear all day entries safely
    public void clearDayEntries() {
        for (LearningPathDayEntry entry : new ArrayList<>(dayEntries)) {
            removeDayEntry(entry);
        }
    }

    public void setDayEntries(List<LearningPathDayEntry> newDayEntries) {
        this.dayEntries = newDayEntries;
    }
}
