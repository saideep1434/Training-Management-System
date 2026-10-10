import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TechTrainer, TechTrainerAdd } from "../models/TechTrainer.model";
import { map, Observable, tap } from "rxjs";
import { AddAssociateApiResponse, CommonCreateResponse, TechTrainerApiResponse } from "../models/ApiResponses.model";
import { StorageService } from "./storage.service";
import { Associate } from "../models/Person.model";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TechnicalTrainerService {

    apiUrl: string = `${environment.apiBaseUrl}/tech-trainer`;
    constructor(private http: HttpClient){};

    TrainerDetails: TechTrainer[];

    addTechTrainer(endpoint: string, techTrainerData: TechTrainerAdd) : Observable<AddAssociateApiResponse>{
        console.log("This is getting called");
        console.log(techTrainerData);
        // const token = StorageService.getToken();
        // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
        return this.http.post<AddAssociateApiResponse>(`${this.apiUrl}/${endpoint}`, techTrainerData, ).pipe(
            map(response => {
                console.log("Message : ", response.message, response.status);
                if(response.status == 201){
                    console.log("Tech trainer added successfully", response.message);
                    return response;
                }
                else{
                    console.error("Error adding the Technical Triainer to the database", response.message);
                    throw new Error("Error creating the technical trainer in the database");
                }
            })
        )
    }

    fetchTechTrainerDetails(endpoint: string) : Observable<TechTrainer[]>{
        // const token = StorageService.getToken();
        // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
        return this.http.get<TechTrainerApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
            map(response => {
                if(response.status == 200 && response.technicalTrainerList){
                    return response.technicalTrainerList;
                }
                else{
                    console.error('API response error or missing list:', response.message);
                    throw new Error('Failed to retrieve technical trainer list.');
                }
            })
        )
    }

}
