import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Mentor, MentorAdd } from "../models/Mentor.model";
import { CommonCreateResponse, MentorApiResponse } from "../models/ApiResponses.model";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
}
)
export class MentorService{

    private apiUrl: string = `${environment.apiBaseUrl}/mentors`;

    constructor(private http: HttpClient){}

    fetchMetorDetails(endpoint : string ) : Observable<Mentor[]>{
        return this.http.get<MentorApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
            map(response => {
                if(response.status == 200 && response.mentorList){
                    return response.mentorList;
                }
                else{
                    console.error('API response error or missing list:', response.message);
                    throw new Error('Failed to retrieve mentor list.');
                }
            })
        )
    }

    addNewMentor(endpoint: string, newMentor : MentorAdd): Observable<CommonCreateResponse>{
            return this.http.post<CommonCreateResponse>(`${this.apiUrl}/${endpoint}`, newMentor).pipe(
                map(response => {
                    if(response.status == 201){
                        console.log("Mentor added succesfully", response.message);
                        return response;
                    }
                    else{
                        console.error("Error adding the Mentor to the database", response.message);
                        throw new Error("Error creating the Mentor in the database");
                    }
                })
            )
        }
}
