import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { CohortModel, CohortService } from 'src/app/services/cohort.service';
import { LearningPathOption, DayDetails } from 'src/app/models/learningPath.model';
import { LearningPathService } from 'src/app/services/LearningPath.service';
import { StorageService } from 'src/app/services/storage.service';
import { CalendarComponent } from 'src/app/components/calendar/calendar.component';
import { EventDialogComponent } from 'src/app/components/event-dialog/event-dialog.component';
import { EventModel, EventType } from 'src/app/models/event.model';
import { EditCohortStaffDialogComponent } from './edit-staff.dialog';

@Component({
  selector: 'app-cohort-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginator,
    MatChipsModule,
    MatCheckboxModule,
    MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonToggleModule,
    FormsModule,
    CalendarComponent,
    MatTabsModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './cohort-details.component.html',
  styleUrls: ['./cohort-details.component.scss']
})
export class CohortDetailsComponent implements OnInit {
  cohort: CohortModel | undefined;
  cohortId: string | null = null;

  cohortEvents: EventModel[] = [];
  learningPath: LearningPathOption | undefined;
  timeline: Array<{ dayNumber: number; date: string; topic: string; description: string; events: EventModel[] }> = [];
  selectedTabIndex = 0;

  isTechnicalTrainer: boolean = false;
  isCoach: boolean = false;
  isBhTrainer: boolean = false;
  isAcademicCoordinator: boolean = false;
  isMentor: boolean = false;
  isAdmin: boolean = false;
  // Precomputed allowed event types for the current user
  allowedEventTypes: EventType[] = [];
  currentUserId: string = 'user123';
  availableTopics: string[] = ['Topic A', 'Topic B', 'Topic C'];
  currentUserAssociateId: '';

  selectedDate: string = new Date().toISOString().split('T')[0];
  // Pagination-by-date state
  anchorDate: string = new Date().toISOString().split('T')[0];
  direction: 'future' | 'past' = 'future';
  pageIndex = 0;
  pageSize = 10;

  // Loading states
  isLoadingCohort = false;
  isLoadingEvents = false;

  // KPI visibility helpers
  get totalEvents(): number { return this.cohortEvents?.length || 0; }
  get durationDays(): number {
    if (!this.cohort?.trainingStartDate || !this.cohort?.trainingEndDate) return 0;
    const s = new Date(this.cohort.trainingStartDate);
    const e = new Date(this.cohort.trainingEndDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(diff, 0);
  }
  get daysRemaining(): number {
    if (!this.cohort?.trainingEndDate) return 0;
    const today = new Date();
    const e = new Date(this.cohort.trainingEndDate);
    const diff = Math.ceil((e.getTime() - new Date(today.toDateString()).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cohortService: CohortService,
    private learningPathService: LearningPathService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isTechnicalTrainer = StorageService.isTechTrainerLoggedIn();
    this.isCoach = StorageService.isCoachLoggedIn();
    this.isBhTrainer = StorageService.isBhTrainerLoggedIn();
    this.isAcademicCoordinator = StorageService.isAcademicCoordinatorLoggedIn();
    this.isAdmin = StorageService.isAdminLoggedIn();
    this.isMentor = typeof (StorageService as any).isMentorLoggedIn === 'function' ? (StorageService as any).isMentorLoggedIn() : false;
    this.allowedEventTypes = this.computeAllowedEventTypes();
    this.route.paramMap.subscribe(params => {
      this.cohortId = params.get('id');
      if (this.cohortId) {
        this.isLoadingCohort = true;
        this.loadCohortDetails();
        this.isLoadingEvents = true;
        this.loadCohortEvents();
      }
    });
    
  }

  openEditStaffDialog(): void {
    if (!this.isAdmin || !this.cohort) { return; }
    const ref = this.dialog.open(EditCohortStaffDialogComponent, {
      width: '520px',
      data: { cohort: this.cohort }
    });
    ref.afterClosed().subscribe(result => {
      if (result && this.cohortId) {
        this.cohortService.updateCohortStaff(+this.cohortId, result).subscribe({
          next: (updated) => {
            this.snackBar.open('Cohort staff updated', 'Dismiss', { duration: 3000 });
            this.cohort = updated;
          },
          error: () => this.snackBar.open('Failed to update staff', 'Dismiss', { duration: 3000 })
        });
      }
    });
  }

  private computeAllowedEventTypes(): EventType[] {
    // Coach can add any kind of event
    if (this.isCoach || this.isAcademicCoordinator) {
      return [
        EventType.TRAINER_CONNECT,
        EventType.MENTOR_CONNECT,
        EventType.COACH_CONNECT,
        EventType.BH_TRAINER_CONNECT,
        EventType.PROJECT,
        EventType.MEETING
      ];
    }
    // BH Trainer can add only the BH_TRAINER_CONNECT
    if (this.isBhTrainer) {
      return [EventType.BH_TRAINER_CONNECT];
    }
    // Technical Trainer can add TRAINER_CONNECT, MEETING, PROJECT
    if (this.isTechnicalTrainer) {
      return [EventType.TRAINER_CONNECT, EventType.MEETING, EventType.PROJECT];
    }
    // Mentors can create mentor connects for their cohorts
    if (this.isMentor) {
      return [EventType.MENTOR_CONNECT];
    }
    // Others cannot add
    return [];
  }

  loadCohortDetails(): void {
    this.cohortService.fetchCohortDetailsById(`${this.cohortId}`).subscribe(cohort => {
      this.cohort = cohort;
      if (this.cohort?.learningPathId) {
        this.loadLearningPath(this.cohort.learningPathId);
      }
      this.buildTimeline();
      this.isLoadingCohort = false;
    },
    _err => {
      this.isLoadingCohort = false;
    });
  }

  loadCohortEvents(): void {
    if (!this.cohortId) return;
    this.cohortService.fetchEventsByCohortId(+this.cohortId).subscribe(events => {
      this.cohortEvents = events;
      // Reset pagination on load
      this.pageIndex = 0;
      this.buildTimeline();
      this.isLoadingEvents = false;
    }, _err => {
      this.isLoadingEvents = false;
    });
  }

  loadLearningPath(id: number): void {
    this.learningPathService.getLearningPathById(id).subscribe((lp: LearningPathOption) => {
      this.learningPath = lp;
      this.buildTimeline();
    });
  }

  private formatYmd(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private addDays(base: Date, days: number): Date {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  }

  buildTimeline(): void {
    if (!this.cohort || !this.cohort.trainingStartDate || !this.learningPath) {
      return;
    }
    const start = new Date(this.cohort.trainingStartDate);
    const events = this.cohortEvents ?? [];
    const dayDetails: DayDetails[] = (this.learningPath.dayDetails || []).slice();
    const timeline = dayDetails
      .sort((a: DayDetails, b: DayDetails) => a.dayNumber - b.dayNumber)
      .map((day: DayDetails) => {
        const date = this.formatYmd(this.addDays(start, (day.dayNumber || 1) - 1));
        const dayEvents = events
          .filter(ev => ev.date === date)
          .sort((a, b) => (a.startHour - b.startHour) || (a.endHour - b.endHour));
        return {
          dayNumber: day.dayNumber,
          date,
          topic: day.topic,
          description: day.description,
          events: dayEvents
        };
      });
    this.timeline = timeline;
  }

  openEventDetails(event: EventModel): void {
    this.dialog.open(EventDialogComponent, {
      width: '500px',
      data: {
        date: event.date,
        userId: this.currentUserId,
        availableTopics: this.availableTopics,
        existingEvents: this.cohortEvents.filter(ev => ev.date === event.date),
        editableEvent: event,
        canEdit: this.allowedEventTypes.length > 0,
        allowedTypes: this.allowedEventTypes
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        result.cohortId = +this.cohortId!;   // ✅ always attach cohortId
        if (result.id) {
          this.cohortService.updateEvent(result.id, result).subscribe(updated => {
            const index = this.cohortEvents.findIndex(ev => ev.id === updated.id);
            if (index > -1) {
              this.cohortEvents[index] = updated;
            }
          });
        }
      }
    });
  }

  onEventAdded(event: EventModel): void {
    if (!this.cohortId) return;
    event.cohortId = +this.cohortId;
    // Ensure creator associate id is attached from storage (dialog already sets it, this is a safeguard)
    const assocId = StorageService.getAssociateId();
    if (assocId) {
      event.eventCreatorAssociateId = assocId;
    }
    // Collision detection: warn if overlapping with existing events on the same date
    const sameDayEvents = this.cohortEvents.filter(ev => ev.date === event.date);
    const overlaps = sameDayEvents.filter(ev => this.isOverlapping(ev.startHour, ev.endHour, event.startHour, event.endHour));
    if (overlaps.length > 0) {
      this.snackBar.open('Warning: This event overlaps with an existing event and may need rescheduling.', 'Dismiss', {
        duration: 6000,
        panelClass: ['snackbar-warning']
      });
    }
      // ✅ attach cohortId before saving
    this.cohortService.addEvent(event).subscribe(saved => {
      this.cohortEvents.push(saved);
    });
  }

  private isOverlapping(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
    // consider [start, end) intervals
    return aStart < bEnd && bStart < aEnd;
  }

  onDayClicked(date: Date): void {
    if (this.allowedEventTypes.length === 0) {
      this.snackBar.open('You are not allowed to add events.', 'Dismiss', { duration: 3000 });
      return;
    }
    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');

    const eventsForDay = this.cohortEvents.filter(ev => ev.date === dateString);

    this.dialog.open(EventDialogComponent, {
      width: '500px',
      data: {
        date: dateString,
        userId: this.currentUserId,
        availableTopics: this.availableTopics,
        existingEvents: eventsForDay,
        allowedTypes: this.allowedEventTypes,
        canEdit: this.allowedEventTypes.length > 0
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        result.cohortId = +this.cohortId!;   // ✅ attach cohortId
        if (result.id) {
          this.cohortService.updateEvent(result.id, result).subscribe(updated => {
            const index = this.cohortEvents.findIndex(ev => ev.id === updated.id);
            if (index > -1) {
              this.cohortEvents[index] = updated;
            }
          });
        } else {
          this.onEventAdded(result);
        }
      }
    });
  }

  openAddEventDialog(): void {
    if (this.allowedEventTypes.length === 0) {
      this.snackBar.open('You are not allowed to add events.', 'Dismiss', { duration: 3000 });
      return;
    }
    this.dialog.open(EventDialogComponent, {
      width: '500px',
      data: {
        date: this.selectedDate,
        userId: this.currentUserId,
        availableTopics: this.availableTopics,
        existingEvents: this.cohortEvents.filter(ev => ev.date === this.selectedDate),
        allowedTypes: this.allowedEventTypes,
        canEdit: this.allowedEventTypes.length > 0
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        result.cohortId = +this.cohortId!;   // ✅ attach cohortId
        this.onEventAdded(result);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  // ===== Pagination-by-date helpers =====
  private compareDateTime(a: EventModel, b: EventModel): number {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.startHour - b.startHour) || (a.endHour - b.endHour);
  }

  private compareDateTimeDesc(a: EventModel, b: EventModel): number {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    const t = (b.startHour - a.startHour) || (b.endHour - a.endHour);
    return t;
  }

  private toYmd(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  onAnchorDateChange(date: Date | null): void {
    if (!date) return;
    this.anchorDate = this.toYmd(date);
    this.pageIndex = 0;
  }

  onDirectionChange(val: 'future' | 'past'): void {
    this.direction = val;
    this.pageIndex = 0;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 0;
  }

  nextPage(): void {
    if ((this.pageIndex + 1) * this.pageSize < this.totalItems) {
      this.pageIndex++;
    }
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }

  get filteredEvents(): EventModel[] {
    const base = this.cohortEvents ?? [];
    if (!this.anchorDate) return base;
    if (this.direction === 'future') {
      return base.filter(ev => ev.date >= this.anchorDate).sort((a,b) => this.compareDateTime(a,b));
    } else {
      return base.filter(ev => ev.date < this.anchorDate).sort((a,b) => this.compareDateTimeDesc(a,b));
    }
  }

  get totalItems(): number { return this.filteredEvents.length; }

  get pagedEvents(): EventModel[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEvents.slice(start, end);
  }

  // Loading aggregate
  get isLoading(): boolean { return this.isLoadingCohort || this.isLoadingEvents; }

  get groupedPagedEvents(): { date: string; events: EventModel[] }[] {
    const byDate = new Map<string, EventModel[]>();
    for (const ev of this.pagedEvents) {
      if (!byDate.has(ev.date)) byDate.set(ev.date, []);
      byDate.get(ev.date)!.push(ev);
    }
    // Keep order as appears in pagedEvents
    const groups: { date: string; events: EventModel[] }[] = [];
    for (const [date, events] of byDate.entries()) {
      groups.push({ date, events });
    }
    // Sort groups by date according to current direction
    groups.sort((a,b) => this.direction === 'future' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    return groups;
  }

  // Range display helpers to avoid using Math in templates
  get pageStart(): number {
    if (this.totalItems === 0) return 0;
    return this.pageIndex * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalItems);
  }

  // --- UI helpers for events list ---
  getTypeLabel(type: EventType): string {
    // Show human-friendly form: TRAINER_CONNECT -> Trainer connect
    return String(type).replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  }

  // --- Next Event helpers ---
  getNextUpcomingEvent(): EventModel | undefined {
    const today = this.toYmd(new Date());
    const future = (this.cohortEvents || []).filter(ev => ev.date >= today);
    future.sort((a,b) => this.compareDateTime(a,b));
    return future[0];
  }
  jumpToNextEvent(): void {
    const next = this.getNextUpcomingEvent();
    if (!next) { return; }
    this.selectedTabIndex = 0; // calendar tab
    this.anchorDate = next.date;
    this.direction = 'future';
    this.pageIndex = 0;
  }

  getTypeClass(type: EventType): string {
    switch (type) {
      case EventType.TRAINER_CONNECT:
        return 'type-trainer';
      case EventType.MENTOR_CONNECT:
        return 'type-mentor';
      case EventType.COACH_CONNECT:
        return 'type-coach';
      case EventType.BH_TRAINER_CONNECT:
        return 'type-bh';
      case EventType.PROJECT:
        return 'type-project';
      case EventType.MEETING:
        return 'type-meeting';
      default:
        return '';
    }
  }

  getTypeIcon(type: EventType): string {
    switch (type) {
      case EventType.TRAINER_CONNECT:
        return 'school';
      case EventType.MENTOR_CONNECT:
        return 'psychology';
      case EventType.COACH_CONNECT:
        return 'sports_kabaddi';
      case EventType.BH_TRAINER_CONNECT:
        return 'diversity_3';
      case EventType.PROJECT:
        return 'work';
      case EventType.MEETING:
        return 'groups';
      default:
        return 'event';
    }
  }

  // --- Event type filtering ---
  selectedTypeFilters = new Set<EventType>();
  allTypes: EventType[] = [
    EventType.TRAINER_CONNECT,
    EventType.MENTOR_CONNECT,
    EventType.COACH_CONNECT,
    EventType.BH_TRAINER_CONNECT,
    EventType.PROJECT,
    EventType.MEETING
  ];
  toggleTypeFilter(type: EventType): void {
    if (this.selectedTypeFilters.has(type)) {
      this.selectedTypeFilters.delete(type);
    } else {
      this.selectedTypeFilters.add(type);
    }
    this.pageIndex = 0;
  }
  isTypeSelected(type: EventType): boolean {
    return this.selectedTypeFilters.size === 0 || this.selectedTypeFilters.has(type);
  }

  get groupedEvents(): { date: string; events: EventModel[] }[] {
    const byDate = new Map<string, EventModel[]>();
    for (const ev of this.cohortEvents ?? []) {
      if (!byDate.has(ev.date)) byDate.set(ev.date, []);
      byDate.get(ev.date)!.push(ev);
    }
    // sort events in each date by start hour
    for (const [, list] of byDate) {
      list.sort((a, b) => a.startHour - b.startHour || a.endHour - b.endHour);
    }
    // sort dates ascending
    const dates = Array.from(byDate.keys()).sort((a, b) => a.localeCompare(b));
    return dates.map(d => ({ date: d, events: byDate.get(d)! }));
  }
}
