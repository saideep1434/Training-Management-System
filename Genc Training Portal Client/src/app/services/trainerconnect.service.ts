import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainerConnectService {

  private baseUrl = '/api/trainer-connects';

  constructor(private http: HttpClient) {}

  addTrainerConnect(connectData: any): Observable<any> {
    return this.http.post(this.baseUrl, connectData);
  }
}
