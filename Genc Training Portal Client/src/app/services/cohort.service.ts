// src/app/services/cohort.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { Cohort } from '../models/class/cohort.model';
import { Trainee } from '../models/class/trainee.model';
import { CohortMember } from '../models/class/cohortmember.model';

import { TechTrainer, TechTrainerOptionsModel } from '../models/TechTrainer.model';
import { BhTrainer } from '../models/BhTrainer.model';
import { Coach } from '../models/coach.model';
import { Mentor } from '../models/Mentor.model';
import { Location } from '../models/location.model';
import { Domain } from '../models/domain.model';
import { LearningPath, LearningPathOption } from '../models/learningPath.model';
import { vertical } from '../models/vertical.model';
import { HireType } from '../models/hiretype.model';
import { ServiceLine } from '../models/serviceLine.model';
import { AssociateForRequest } from '../models/Person.model';

import { CohortApiResponse, cohortCreateApiResponse, SingleCohortApiResponse } from '../models/ApiResponses.model';
import { EventModel } from '../models/event.model';

import { TechnicalTrainerService } from './trainer.service';
import { BHTrainerService } from './bhtrainer.service';
import { CoachService } from './coach.service';
import { MentorService } from './mentor.service';
import { LocationService } from './location.service';
import { DomainService } from './domain.service';
import { LearningPathService } from './LearningPath.service';
import { VerticalService } from './verticals.service';
import { HireTypeService } from './hireType.service';
import { ServiceLineService } from './serviceLine.service';

interface Option {
  label: string;
  value: string;
}

export interface CoachDto {
  coachId: number;
  coachName: string;
  coachEmail: string;
  coachAssociateId: string;
}

export interface MentorDto {
  mentorId: number;
  mentorName: string;
  mentorEmail: string;
  mentorAssociateId: string;
}

export interface BhTrainerDto {
  bhTrainerId: number;
  bhTrainerName: string;
  bhTrainerEmail: string;
  bhTrainerAssociateId: string;
}

export interface TechnicalTrainerDto {
  technialTrainerId: number;
  techTrainerName: string;
  techTrainerEmail: string;
  techTrainerAssociateId: string;
  description: string;
  status: string;
}

export interface CohortModel {
  cohortId: number;
  cohortCode: string;
  domainName?: string;
  coach: CoachDto;
  mentor: MentorDto;
  bhTrainer: BhTrainerDto;
  location: string;
  hireType: string;
  vertical: string;
  serviceLine: string;
  learningPathId: number;
  dateOfJoining: string;
  trainingStartDate: string;
  trainingEndDate: string;
  technicalTrainer?: TechnicalTrainerDto;
}

export interface cohortResponseById {
  status: number;
  message: string;
  cohort: CohortModel;
}

@Injectable({
  providedIn: 'root'
})
export class CohortService {
  private cohortApiUrl = `${environment.apiBaseUrl}/cohorts`;
  private eventApiUrl = `${environment.apiBaseUrl}/events`;

  constructor(
    private http: HttpClient,
    private techTrainerService: TechnicalTrainerService,
    private bhTrainerService: BHTrainerService,
    private coachService: CoachService,
    private mentorService: MentorService,
    private locationService: LocationService,
    private domainService: DomainService,
    private learningPathService: LearningPathService,
    private verticalService: VerticalService,
    private hireTypeService: HireTypeService,
    private serviceLineService: ServiceLineService
  ) {}

  // ========== Cohort CRUD APIs ==========
  addCohort(endpoint: string, newCohortData: Cohort): Observable<Cohort> {
    return this.http.post<cohortCreateApiResponse>(`${this.cohortApiUrl}/${endpoint}`, newCohortData).pipe(
      map(response => {
        if (response.status === 201 && response.cohort) {
          return response.cohort;
        } else {
          throw new Error(response.message || 'Error adding the cohort');
        }
      })
    );
  }

  fetchAllCohortsDetails(endpoint: string): Observable<Cohort[]> {
    return this.http.get<CohortApiResponse>(`${this.cohortApiUrl}/${endpoint}`).pipe(
      map(response => {
        if (response.status === 200 && response.cohortList) {
          return response.cohortList;
        } else {
          throw new Error(response.message || 'Error fetching cohort details');
        }
      })
    );
  }

  fetchAllCohortsDetailsByRole(endpoint: string, associate: AssociateForRequest): Observable<Cohort[]> {
    return this.http.post<CohortApiResponse>(`${this.cohortApiUrl}/${endpoint}`, associate).pipe(
      map(response => {
        if (response.status === 200 && response.cohortList) {
          return response.cohortList;
        } else {
          throw new Error(response.message || 'Error fetching cohorts by role');
        }
      })
    );
  }

  fetchCohortDetailsById(endpoint: string): Observable<CohortModel> {
    return this.http.get<cohortResponseById>(`${this.cohortApiUrl}/${endpoint}`).pipe(
      map(response => {
        if (response.status === 200 && response.cohort) {
          return response.cohort;
        } else {
          throw new Error(response.message || 'Error fetching cohort details');
        }
      })
    );
  }

  // ========== Event APIs ==========
  fetchEventsByCohortId(cohortId: number): Observable<EventModel[]> {
    return this.http.get<any>(`${this.eventApiUrl}/cohort/${cohortId}`).pipe(
      map(response => {
        // Normalize response: expect { status, events }
        if (!response) { return []; }
        if (Array.isArray(response)) { return response as EventModel[]; }
        if (response.status === 200 && Array.isArray(response.events)) {
          return response.events as EventModel[];
        }
        if (response.events) { return response.events as EventModel[]; }
        return [];
      }),
      catchError(() => of([]))
    );
  }

  fetchEventsByDate(date: string): Observable<EventModel[]> {
    return this.http.get<any>(`${this.eventApiUrl}/date/${date}`).pipe(
      map(response => response.events || [])
    );
  }

  addEvent(event: EventModel): Observable<EventModel> {
    return this.http.post<any>(`${this.eventApiUrl}/add`, event).pipe(
      map(response => {
        if((response.status === 200 || response.status === 201) && response.event){
          return response.event
        }
        else{
          throw new Error(response.message || 'Error fetching cohort details');
        }
      }
    ));
  }

  updateEvent(id: number, event: EventModel): Observable<EventModel> {
    return this.http.put<any>(`${this.eventApiUrl}/update/${id}`, event).pipe(
      map(response => response.event)
    );
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.eventApiUrl}/delete/${id}`);
  }

  // ========== Dropdown Data Fetchers ==========
  fetchTechnicalTrainers(): Observable<Option[]> {
    return this.techTrainerService.fetchTechTrainerDetails("all-tech-trainers").pipe(
      map((response: TechTrainer[]) =>
        response.map(trainer => ({
          label: trainer.techTrainerName,
          value: trainer.techTrainerAssociateId.toString()
        }))
      ),
      catchError(() => of([]))
    );
  }

  fetchBHTrainers(): Observable<Option[]> {
    return this.bhTrainerService.fetchBhTrainersDetails("all-bh-trainers").pipe(
      map((response: BhTrainer[]) =>
        response.map(bhTrainer => ({
          label: bhTrainer.bhTrainerName,
          value: bhTrainer.bhTrainerAssociateId.toString()
        }))
      ),
      catchError(() => of([]))
    );
  }

  fetchCoaches(): Observable<Option[]> {
    return this.coachService.fetchCoachDetails("all-coaches").pipe(
      map((response: Coach[]) =>
        response.map(coach => ({
          label: coach.coachName,
          value: coach.coachAssociateId.toString()
        }))
      ),
      catchError(() => of([]))
    );
  }

  fetchMentors(): Observable<Option[]> {
    return this.mentorService.fetchMetorDetails("all-mentors").pipe(
      map((response: Mentor[]) =>
        response.map(mentor => ({
          label: mentor.mentorName,
          value: mentor.mentorAssociateId.toString()
        }))
      ),
      catchError(() => of([]))
    );
  }

  fetchLocations(): Observable<Option[]> {
    return this.locationService.fetchLocations("all-locations").pipe(
      map((response: Location[]) =>
        response.map(location => ({
          label: location.location,
          value: location.locationId.toString()
        }))
      ),
      catchError(() => of([]))
    );
  }

  fetchDomains(): Observable<Option[]> {
    return this.domainService.fetchDomains("all-domains").pipe(
      map((response: Domain[]) =>
        response.map(domain => ({
          label: domain.domainName,
          value: domain.domainName.toString()
        }))
      ),
      catchError(() => of([]))
    );
  }

  fetchVerticals(): Observable<Option[]> {
    return this.verticalService.fetchVerticals("all-verticals").pipe(
      map((response: vertical[]) =>
        response.map(v => ({
          label: v.verticalName,
          value: v.verticalId.toString()
        }))
      ),
      catchError(() => of([]))
    );
  }

  fetchHireTypes(): Observable<Option[]> {
    return this.hireTypeService.fetchHireTypes("all-hire-types").pipe(
      map((response: HireType[]) =>
        response.map(h => ({
          label: h.hireType,
          value: h.hireTypeId.toString()
        }))
      ),
      catchError(() => of([]))
    );
  }

  fetchServiceLines(): Observable<ServiceLine[]> {
    return this.serviceLineService.fetchAllServiceLines("all").pipe(
      map((response: ServiceLine[]) => response),
      catchError(() => of([]))
    );
  }

  fetchLearningPaths(): Observable<LearningPathOption[]> {
    return this.learningPathService.fetchLearningPaths("basic-info").pipe(
      map((response: LearningPathOption[]) => response),
      catchError(() => of([]))
    );
  }

  // ========== Admin-only: Update Cohort Staff ==========
  updateCohortStaff(cohortId: number, payload: CohortStaffUpdateDto): Observable<CohortModel> {
    return this.http.put<any>(`${this.cohortApiUrl}/${cohortId}/staff`, payload).pipe(
      map(response => {
        if ((response.status === 200) && response.cohort) {
          return response.cohort as CohortModel;
        }
        throw new Error(response.message || 'Failed to update cohort staff');
      })
    );
  }
}

export interface CohortStaffUpdateDto {
  techTrainerAssociateId?: string | null;
  coachAssociateId?: string | null;
  mentorAssociateId?: string | null;
  bhTrainerAssociateId?: string | null;
}
