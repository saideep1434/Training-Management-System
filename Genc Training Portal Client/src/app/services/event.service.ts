// src/app/services/event.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventModel } from '../models/event.model'; 

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventsSubject: BehaviorSubject<EventModel[]> = new BehaviorSubject<EventModel[]>([]);

  constructor() {
    // Initialize with empty or predefined events if needed
    const initialEvents: EventModel[] = [];
    this.eventsSubject.next(initialEvents);
  }

  getEvents(): Observable<EventModel[]> {
    return this.eventsSubject.asObservable();
  }

  getEventsByDate(date: string): Observable<EventModel[]> {
    return this.eventsSubject.pipe(
      map(events => events.filter(event => event.date === date))
    );
  }

  addEvent(event: EventModel): Observable<EventModel> {
    const currentEvents = this.eventsSubject.getValue();
    event.id = event.id ?? Math.floor(Math.random() * 1000000);
    currentEvents.push(event);
    this.eventsSubject.next(currentEvents);
    return of(event);
  }

  updateEvent(updatedEvent: EventModel): Observable<EventModel> {
    const events = this.eventsSubject.getValue();
    const index = events.findIndex(event => event.id === updatedEvent.id);
    if (index !== -1) {
      events[index] = updatedEvent;
      this.eventsSubject.next(events);
      return of(updatedEvent);
    }
    return of(null as any);
  }

  deleteEvent(eventId: number): Observable<boolean> {
    const events = this.eventsSubject.getValue();
    const updatedEvents = events.filter(event => event.id !== eventId);
    this.eventsSubject.next(updatedEvents);
    return of(true);
  }
}
