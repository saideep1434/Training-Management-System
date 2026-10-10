// import { HttpClient } from "@angular/common/http";
// import { Inject, Injectable } from "@angular/core";
// import { map, Observable } from "rxjs";
// import { serviceLineApiResponse } from "../models/ApiResponses.model";
// import { ServiceLine } from "../models/serviceLine.model";

// @Injectable({
//     providedIn:'root'
// })
// export class ServiceLineService{
//     constructor(private http: HttpClient){}

//     private apiUrl = "http://localhost:8083/api/service-line"

//     fetchAllServiceLines(endpoint: string) : Observable<ServiceLine[]>{
//         return this.http.get<serviceLineApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
//             map(response => {
//                 if(response.status === 200 && response.serviceLines){
//                     console.log("Service lines fetched successfully");
//                     return response.serviceLines;
//                 }
//                 else{
//                     console.error("Error fetching the service lines", response.message);
//                     throw new Error("Error fetching the service lines details");
//                 }
//             })
//         )
//     }
// }

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
// --- CRITICAL CHANGE: Correct import path and capitalized interface name ---

import { ServiceLine } from "../models/serviceLine.model";

import { serviceLineApiResponse } from "../models/ApiResponses.model";
import { Domain } from "../models/domain.model"; // Included for completeness, though not directly used in this service
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ServiceLineService {
    constructor(private http: HttpClient) { }

    private apiUrl = `${environment.apiBaseUrl}/service-line`; // Base URL for ServiceLine APIs

    /**
     * Fetches all service lines from the backend.
     * @param endpoint The specific endpoint for fetching all service lines (e.g., 'all-service-lines').
     * @returns An Observable of an array of ServiceLine objects.
     */
    fetchAllServiceLines(endpoint: string): Observable<ServiceLine[]> {
        // --- CRITICAL CHANGE: Use ServiceLineApiResponse here (capitalized) ---
        return this.http.get<serviceLineApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
            map(response => {
                if (response.status === 200 && response.serviceLines) {
                    console.log("Service lines fetched successfully:", response.serviceLines);
                    return response.serviceLines;
                } else if (response.status === 404 && response.message === "No Service Lines found.") {
                    console.warn("No service lines found:", response.message);
                    return []; // Return empty array if no service lines found
                }
                // Handle other error cases or unexpected responses
                console.error("Error fetching service lines:", response.message || "Unknown error or unexpected response structure.");
                throw new Error(response.message || "Error fetching the service line details");
            })
        );
    }

    /**
     * Adds a new service line to the backend.
     * @param serviceLine The ServiceLine object to add (should contain trackName and domainName).
     * @returns An Observable of the backend's generic Response.
     */
    addServiceLine(serviceLine: ServiceLine): Observable<serviceLineApiResponse> {
        // Backend expects DTO with trackName and domainName
        const payload = {
            trackName: serviceLine.trackName,
            domainName: serviceLine.domainName
        };
        console.log('Sending Add ServiceLine Request:', payload);
        // --- CRITICAL CHANGE: Use ServiceLineApiResponse here (capitalized) ---
        return this.http.post<serviceLineApiResponse>(`${this.apiUrl}/add`, payload).pipe(
            map(response => {
                console.log('Add ServiceLine Response:', response);
                if (response.status === 201 || response.status === 409 || response.status === 404) {
                    return response; // Return the full response for status/message handling in component
                }
                throw new Error(response.message || 'Error adding service line.');
            })
        );
    }

    /**
     * Updates an existing service line on the backend by its track name.
     * This method is aligned with your backend's `updateServiceLine(String trackName, ServiceLineDto serviceLineDto)`
     * @param originalTrackName The CURRENT track name of the service line to update (used in URL path).
     * @param updatedServiceLine The ServiceLine object with updated data (contains potentially new trackName, domainName).
     * @returns An Observable of the backend's generic Response.
     */
    // --- CRITICAL CHANGE: Parameter changed from serviceLineId to originalTrackName ---
    updateServiceLine(originalTrackName: string, updatedServiceLine: ServiceLine): Observable<serviceLineApiResponse> {
        // Backend expects DTO with trackName and domainName
        const payload = {
            trackName: updatedServiceLine.trackName, // Send the new track name
            domainName: updatedServiceLine.domainName
        };
        console.log(`Sending Update ServiceLine Request for '${originalTrackName}':`, payload);
        // --- CRITICAL CHANGE: Endpoint changed to /updateByName/{trackName} ---
        return this.http.put<serviceLineApiResponse>(`${this.apiUrl}/updateByName/${originalTrackName}`, payload).pipe(
            map(response => {
                console.log('Update ServiceLine Response:', response);
                if (response.status === 200 || response.status === 404 || response.status === 409) { // Added 409 Conflict
                    return response; // Return the full response for status/message handling in component
                }
                throw new Error(response.message || 'Error updating service line.');
            })
        );
    }

    /**
     * Deletes a service line from the backend by its track name.
     * This method is aligned with your backend's `deleteServiceLine(String trackName)`
     * @param trackName The track name of the service line to delete.
     * @returns An Observable of the backend's generic Response.
     */
    // --- CRITICAL CHANGE: Parameter changed from serviceLineId to trackName ---
    deleteServiceLine(trackName: string): Observable<serviceLineApiResponse> {
        console.log(`Sending Delete ServiceLine Request for Track Name: '${trackName}'`);
        // --- CRITICAL CHANGE: Endpoint changed to /deleteByName/{trackName} ---
        return this.http.delete<serviceLineApiResponse>(`${this.apiUrl}/deleteByName/${trackName}`).pipe(
            map(response => {
                console.log('Delete ServiceLine Response:', response);
                if (response.status === 200 || response.status === 404) {
                    return response; // Return the full response for status/message handling in component
                }
                throw new Error(response.message || 'Error deleting service line.');
            })
        );
    }
}
