import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { CoachApiResponse, CommonCreateResponse } from "../models/ApiResponses.model";
import { Coach, CoachAdd } from "../models/coach.model";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CoachService{

    apiUrl: string = `${environment.apiBaseUrl}/coach`;

    constructor(private http: HttpClient){}

    fetchCoachDetails(endpoint : string ):Observable<Coach[]>{
        return this.http.get<CoachApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
            map(response => {
                if(response.status == 200 && response.coachs){
                    return response.coachs;
                }
                else{
                    console.error('API response error or missing list:', response.message);
                    throw new Error('Failed to retrieve Coach list.');
                }
            })
        )
    }

    addNewCoach(endpoint: string, newCoach : CoachAdd): Observable<CommonCreateResponse>{
        return this.http.post<CommonCreateResponse>(`${this.apiUrl}/${endpoint}`, newCoach).pipe(
            map(response => {
                if(response.status == 201){
                    console.log("Coach added succesfully", response.message);
                    return response;
                }
                else{
                    console.error("Error adding the Coach to the database", response.message);
                    throw new Error("Error creating the Coach in the database");
                }
            })
        )
    }
}
