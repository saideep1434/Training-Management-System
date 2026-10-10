import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AddAssociateApiResponse, BhTrainerApiResponse, CommonCreateResponse } from "../models/ApiResponses.model";
import { BhTrainer, BhtrainerAdd } from "../models/BhTrainer.model";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BHTrainerService{

    private apiUrl: string = `${environment.apiBaseUrl}/bh-trainers`;

    constructor(private http: HttpClient){}

    fetchBhTrainersDetails(endpoint : string ):Observable<BhTrainer[]>{

        return this.http.get<BhTrainerApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
            map(response => {
                if(response.status==200 && response.bhTrainerList){
                    return response.bhTrainerList;
                }
                else{
                    console.error("API error fetching the details of the Bhtrainers", response.message);
                    throw new Error("Failed to fetch the BhTrainers details");
                }
            })
        )
    }

    addNewBhTrainer(endpoint: string, newBhTrainer : BhtrainerAdd) : Observable<AddAssociateApiResponse>{
        return this.http.post<AddAssociateApiResponse>(`${this.apiUrl}/${endpoint}`, newBhTrainer).pipe(
            map(response => {
                if(response.status == 201){
                    console.log("The new BH Trainer is added successfully", response.message);
                    return response;
                }
                else{
                    console.error("Error adding the new BH Trainer", response.message);
                    throw new Error("There is some error adding the new BH Trainer");
                }
            })
        )
    }




}
