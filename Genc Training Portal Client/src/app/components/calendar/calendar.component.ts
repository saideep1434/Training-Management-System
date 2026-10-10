import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EventModel, EventType } from 'src/app/models/event.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() events: EventModel[] = [];  

  @Input() cohortId!: number;   // Cohort ID coming from parent
  @Output() eventAdded = new EventEmitter<EventModel>();
  @Output() dayClicked = new EventEmitter<Date>();  

  today = new Date();
  viewDate = new Date();
  days: { date: Date; isCurrentMonth: boolean }[] = [];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  selectedDate: Date | null = null;
  eventTypes = Object.values(EventType);  // List of enum values for dropdown

  newEvent: EventModel = { 
    id: 0, 
    date: '', 
    eventCreatorAssociateId: '',
    type: EventType.TRAINER_CONNECT,  // Default enum value
    description: '', 
    startHour: 0, 
    endHour: 0, 
    cohortId: 0
  };

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.generateCalendar();
    if (this.cohortId) {
      this.newEvent.cohortId = this.cohortId;
    }
  }

  generateCalendar() {
    this.days = [];
    const firstDayOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    const lastDayOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);

    const start = new Date(firstDayOfMonth);
    start.setDate(start.getDate() - start.getDay());

    const end = new Date(lastDayOfMonth);
    end.setDate(end.getDate() + (6 - end.getDay()));

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      this.days.push({
        date: new Date(d),
        isCurrentMonth: d.getMonth() === this.viewDate.getMonth()
      });
    }
  }

  prevMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  selectDate(day: { date: Date; isCurrentMonth: boolean }) {
    this.selectedDate = day.date;
    this.dayClicked.emit(day.date);
  }

  addEvent() {
    if (this.selectedDate && this.newEvent.type && this.newEvent.startHour > 0 && this.newEvent.endHour > 0) {
      this.newEvent.date = this.selectedDate.toISOString().split('T')[0];
      this.newEvent.cohortId = this.cohortId; // Attach cohortId before emitting
      this.eventAdded.emit({ ...this.newEvent });

      // Reset for next event
      this.selectedDate = null;
      this.newEvent = { 
        id: 0,
        date: '', 
        eventCreatorAssociateId: '',
        type: EventType.TRAINER_CONNECT,  // reset to default enum value
        description: '', 
        startHour: 0, 
        endHour: 0, 
        cohortId: this.cohortId 
      };
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }

  isSelected(date: Date): boolean {
    return this.selectedDate !== null &&
           date.getFullYear() === this.selectedDate.getFullYear() &&
           date.getMonth() === this.selectedDate.getMonth() &&
           date.getDate() === this.selectedDate.getDate();
  }
}
