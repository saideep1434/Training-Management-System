import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Location, LocationApiResponse } from "../models/location.model";
import { domainApiResponse, HireTypeApiResponse } from "../models/ApiResponses.model";
import { Domain } from "../models/domain.model";
import { HireType } from "../models/hiretype.model";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HireTypeService {

    constructor(private http: HttpClient){}

    private apiUrl : string = `${environment.apiBaseUrl}/hire-type`;

    fetchHireTypes(endpoint : string) : Observable<HireType[]>{
        return this.http.get<HireTypeApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
            map(response => {
                if(response.status == 200 && response.hireTypeList){
                    console.log("Hire Types are fetched successfully", response.hireTypeList);
                    return response.hireTypeList;
                }
                else{
                    console.error("Error fetching Hire Types", response.message);
                    throw new Error("Error fetching the Hire Types");
                }
            })
        )
    }
}
