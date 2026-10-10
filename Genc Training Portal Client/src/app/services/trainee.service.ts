import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Trainee } from '../models/class/trainee.model';
import { TraineeApiResponse } from '../models/ApiResponses.model';
import { environment } from '../../environments/environment';

export interface BulkRowResult {
  index: number;
  traineeAssociateId?: string;
  traineeEmail?: string;
  status: 'CREATED' | 'UPDATED' | 'SKIPPED' | 'FAILED';
  reason?: string;
}

export interface TraineeDto {
  traineeId: number;
  traineeName: string;
  traineeAssociateId: string;
  traineeEmail: string;
  domainName?: string | null;
  skills?: string;
  cohortId?: number | null;
}

export interface TraineeListResponse {
  status: number;
  message: string;
  traineeList: TraineeDto[];
}

@Injectable({ providedIn: 'root' })
export class TraineeService {
  private apiUrl = `${environment.apiBaseUrl}/trainee`;
  constructor(private http: HttpClient) {}

  fetchAllTrainees(): Observable<Trainee[]> {
    return this.http.get<TraineeApiResponse>(`${this.apiUrl}/all-trainees`).pipe(
      map(resp => {
        if (resp.status === 200 && Array.isArray(resp.traineeList)) {
          return resp.traineeList;
        }
        throw new Error(resp.message || 'Failed to fetch trainees');
      })
    );
  }

  addTrainee(dto: Omit<TraineeDto, 'traineeId'>): Observable<TraineeDto> {
    return this.http.post<any>(`${this.apiUrl}/add`, dto).pipe(
      map(res => {
        if ((res.status === 200 || res.status === 201) && res.trainee) {
          return res.trainee as TraineeDto;
        }
        throw new Error(res.message || 'Failed to add trainee');
      })
    );
  }

  filterTrainees(options: { domain?: string; skills?: string; unassignedOnly?: boolean }): Observable<TraineeDto[]> {
    let params = new HttpParams();
    if (options.domain) params = params.set('domain', options.domain);
    if (options.skills) params = params.set('skills', options.skills);
    if (options.unassignedOnly) params = params.set('unassignedOnly', String(options.unassignedOnly));
    return this.http.get<TraineeListResponse>(`${this.apiUrl}/filter`, { params }).pipe(
      map(res => res.traineeList || [])
    );
  }

  assignTraineesToCohort(traineeIds: number[], cohortId: number): Observable<void> {
    const params = new HttpParams().set('cohortId', String(cohortId));
    return this.http.post<any>(`${this.apiUrl}/assign`, traineeIds, { params }).pipe(map(() => void 0));
  }

  /**
   * Bulk upsert trainees on the server.
   * Matching is done server-side by associateId first, then email.
   *
   * @param dtos List of trainees (no traineeId). Optional fields: domainName, skills, cohortId.
   * @param updateExisting When true (default), existing matches get updated; when false, existing rows are skipped.
   * @returns Observable with { status, message, bulkResults? } summary from server. bulkResults contains per-row statuses and reasons.
   */
  bulkUpsert(
    dtos: Array<Omit<TraineeDto, 'traineeId'>>,
    updateExisting = true
  ): Observable<{ status: number; message: string; bulkResults?: BulkRowResult[] }> {
    const params = new HttpParams().set('updateExisting', String(updateExisting));
    // Send the entire batch in one call; server returns a summary message with counts
    return this.http.post<any>(`${this.apiUrl}/bulk-upsert`, dtos, { params }).pipe(
      map(res => ({ status: res.status, message: res.message, bulkResults: res.bulkResults as BulkRowResult[] | undefined }))
    );
  }
}
