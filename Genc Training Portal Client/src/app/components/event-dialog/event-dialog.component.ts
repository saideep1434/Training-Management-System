import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatList, MatListItem } from '@angular/material/list';
import { EventModel, EventType } from 'src/app/models/event.model';
import { StorageService } from 'src/app/services/storage.service';

export interface EventDialogData {
  date: string;
  userId: string;
  availableTopics?: string[];
  existingEvents?: EventModel[];
  editableEvent?: EventModel;
  canEdit?: boolean;
  cohortId?: number;
  // Allowed event types for current user; used to filter dropdown options
  allowedTypes?: EventType[];
}

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatList,
    MatListItem
  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {
  eventType: EventType = EventType.TRAINER_CONNECT; // Default enum (will be overridden by allowedTypes if provided)
  startHour: number = 0;
  endHour: number = 0;
  description: string = '';
  date: string = '';
  cohortId!: number;
  eventCreatorAssociateId: string;

  topicName: string = '';
  customTopicName: string = '';
  topicOptions: string[] = [];

  eventTypes: (EventType | string)[] = Object.values(EventType); // Enum values for dropdown (filtered if allowedTypes provided)

  isEditing: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDialogData,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.date = this.data.date;
    if (this.data.cohortId) this.cohortId = this.data.cohortId;
    // pull creator associate id from local storage
    this.eventCreatorAssociateId = StorageService.getAssociateId() || '';

    if (this.data.availableTopics) {
      this.topicOptions = [...this.data.availableTopics, 'Miscellaneous'];
    }

    if (this.data.editableEvent) {
      this.isEditing = true;
      this.eventType = this.data.editableEvent.type;
      this.startHour = this.data.editableEvent.startHour;
      this.endHour = this.data.editableEvent.endHour;
      this.description = this.data.editableEvent.description;
      this.cohortId = this.data.editableEvent.cohortId;
    }

    // Apply allowedTypes filter if provided
    if (this.data.allowedTypes && this.data.allowedTypes.length > 0) {
      if (this.isEditing) {
        // Ensure current event type is always present to avoid breaking selection
        const set = new Set<EventType>([this.eventType, ...this.data.allowedTypes]);
        this.eventTypes = Array.from(set.values());
      } else {
        this.eventTypes = this.data.allowedTypes;
        // Default selection to first allowed type for add flow
        this.eventType = this.data.allowedTypes[0];
      }
    }
  }

  // Render-friendly label for enum values while keeping value stable for backend
  getTypeLabel(type: EventType | string): string {
    if (!type) return '';
    return String(type)
      .toLowerCase()
      .split('_')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    // For add flow: eventType must be from allowed list when provided
    if (!this.isEditing && this.data.allowedTypes && this.data.allowedTypes.length > 0) {
      if (!this.eventType || !this.data.allowedTypes.includes(this.eventType)) {
        return false;
      }
    }
    // For edit flow: allow saving regardless of allowedTypes, UI already limits selectable options
    if (this.startHour >= this.endHour || !this.description.trim()) {
      return false;
    }
    if (
      this.eventType === EventType.TRAINER_CONNECT &&
      this.topicName === 'Miscellaneous' &&
      !this.customTopicName.trim()
    ) {
      return false;
    }
    return true;
  }

  onSave(): void {
    const event: EventModel = {
      id: this.data.editableEvent ? this.data.editableEvent.id : 0,
      date: this.date,
      eventCreatorAssociateId: this.eventCreatorAssociateId,
      type: this.eventType,
      startHour: this.startHour,
      endHour: this.endHour,
      description: this.description,
      cohortId: this.cohortId
    };


    this.dialogRef.close(event);
  }
}
