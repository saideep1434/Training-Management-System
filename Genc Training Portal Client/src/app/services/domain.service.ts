// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { map, Observable } from "rxjs";
// import { Location, LocationApiResponse } from "../models/location.model";
// import { domainApiResponse } from "../models/ApiResponses.model";
// import { DomainName } from "../models/domain.model";

// @Injectable({
//     providedIn: 'root'
// })
// export class DomainService {

//     constructor(private http: HttpClient){}

//     private apiUrl : string = "http://localhost:8083/api/domain";

//     fetchDomains(endpoint : string) : Observable<DomainName[]>{
//         return this.http.get<domainApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
//             map(response => {
//                 if(response.status == 200 && response.domainNameList){
//                     console.log("Domains are fetched successfully", response.domainNameList);
//                     return response.domainNameList;
//                 }
//                 else{
//                     console.error("Error fetching Domains", response.message);
//                     throw new Error("Error fetching the Domains");
//                 }
//             })
//         )
//     }
// }

// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { map, Observable } from "rxjs";
// // import { Location, LocationApiResponse } from "../models/location.model"; // This import seems unused for DomainService
// import { domainApiResponse } from "../models/ApiResponses.model"; // Ensure this path is correct
// import { Domain } from "../models/domain.model"; // Ensure this path is correct

// @Injectable({
//     providedIn: 'root'
// })
// export class DomainService {

//     constructor(private http: HttpClient) {}

//     private apiUrl: string = "http://localhost:8083/api/domain"; // Your backend API base URL

//     /**
//      * Fetches domains from the backend based on the provided endpoint.
//      * Expected backend response: { status: 200, message: "...", domainNameList: [...] }
//      * @param endpoint The specific API endpoint (e.g., "all").
//      * @returns An Observable of an array of DomainName objects.
//      */
//     fetchDomains(endpoint: string): Observable<Domain[]> {
//         return this.http.get<domainApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
//             map(response => {
//                 if (response.status === 200 && response.domainNameList) {
//                     console.log("Domains are fetched successfully", response.domainNameList);
//                     return response.domainNameList;
//                 } else {
//                     console.error("Error fetching Domains:", response.message);
//                     throw new Error(response.message || "Error fetching the Domains");
//                 }
//             })
//         );
//     }

//     /**
//      * Adds a new domain to the backend.
//      * Expected backend response for "add": { status: 201, message: "...", domainName?: DomainName }
//      * @param newDomain The DomainName object to be added.
//      * @returns An Observable of domainApiResponse.
//      */
//     addDomain(newDomain: Domain): Observable<domainApiResponse> {
//         return this.http.post<domainApiResponse>(`${this.apiUrl}/add`, newDomain).pipe(
//             map(response => {
//                 if (response.status === 201) { // Assuming 201 Created for successful addition
//                     console.log("The new Domain is added successfully", response.message);
//                     return response;
//                 } else {
//                     console.error("Error adding the new Domain:", response.message);
//                     throw new Error(response.message || "There is some error adding the new Domain");
//                 }
//             })
//         );
//     }

//     /**
//      * Updates an existing domain on the backend.
//      * IMPORTANT: Your `DomainName` model only has `domainName: string`.
//      * If your backend uses an ID for updates (e.g., /update/{id}), you'll need
//      * to adjust your `DomainName` model to include that ID.
//      * For now, assuming update is based on the domain name itself or a backend ID derived from it.
//      * Expected backend response for "update/{domainName}": { status: 200, message: "..." }
//      * @param originalDomainName The original domain name (or ID if your backend uses it) of the domain to update.
//      * @param updatedDomain The DomainName object with updated data.
//      * @returns An Observable of domainApiResponse.
//      */
//     updateDomain(originalDomainName: string, updatedDomain: Domain): Observable<domainApiResponse> {
//         // Assuming backend endpoint is /api/domain/update/{originalDomainName}
//         // If your backend uses an ID (e.g., domainId), you'd pass that instead of originalDomainName.
//         return this.http.put<domainApiResponse>(`${this.apiUrl}/update/${originalDomainName}`, updatedDomain).pipe(
//             map(response => {
//                 if (response.status === 200) { // Assuming 200 OK for successful update
//                     console.log(`Domain "${originalDomainName}" updated successfully:`, response.message);
//                     return response;
//                 } else {
//                     console.error(`Error updating Domain "${originalDomainName}":`, response.message);
//                     throw new Error(response.message || `Error updating the Domain "${originalDomainName}"`);
//                 }
//             })
//         );
//     }

//     /**
//      * Deletes a domain from the backend.
//      * Expected backend response for "delete/{domainName}": { status: 200, message: "..." }
//      * @param domainNameToDelete The domain name (or ID) of the domain to delete.
//      * @returns An Observable of domainApiResponse.
//      */
//     deleteDomain(domainNameToDelete: string): Observable<domainApiResponse> {
//         // Assuming backend endpoint is /api/domain/delete/{domainName}
//         // If your backend uses an ID, you'd pass that instead of domainNameToDelete.
//         return this.http.delete<domainApiResponse>(`${this.apiUrl}/delete/${domainNameToDelete}`).pipe(
//             map(response => {
//                 if (response.status === 200) { // Assuming 200 OK for successful delete
//                     console.log(`Domain "${domainNameToDelete}" deleted successfully:`, response.message);
//                     return response;
//                 } else {
//                     console.error(`Error deleting Domain "${domainNameToDelete}":`, response.message);
//                     throw new Error(response.message || `Error deleting the Domain "${domainNameToDelete}"`);
//                 }
//             })
//         );
//     }
// }



// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { map, Observable } from "rxjs";
// //import { DomainApiResponse } from "../models/ApiResponses.model";
// import { domainApiResponse } from "src/app/models/ApiResponses.model";
// //import { DomainApiResponse } from "src/app/models/domain.model";
// //import { Domain } from "../models/domain.model"; // Imports the simplified Domain model
// import { Domain } from "src/app/models/domain.model";
// @Injectable({
//     providedIn: 'root'
// })
// export class DomainService {

//     constructor(private http: HttpClient) {}

//     private apiUrl: string = "http://localhost:8083/api/domain";

//     /**
//      * Fetches domains from the backend based on the provided endpoint.
//      * Expected backend response: { status: 200, message: "...", domainList: [...] }
//      * @param endpoint The specific API endpoint (e.g., "all").
//      * @returns An Observable of an array of Domain objects.
//      */
//     fetchDomains(endpoint: string): Observable<Domain[]> {
//         return this.http.get<domainApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
//             map(response => {
//                 if (response.status === 200 && response.domainNameList) {
//                     console.log("Domains are fetched successfully", response.domainNameList);
//                     return response.domainNameList;
//                 } else {
//                     console.error("Error fetching Domains:", response.message);
//                     throw new Error(response.message || "Error fetching the Domains");
//                 }
//             })
//         );
//     }

//     /**
//      * Adds a new domain to the backend.
//      * Expected backend response for "add": { status: 201, message: "...", domain?: Domain }
//      * @param newDomain The Domain object (containing just domainName) to be added.
//      * @returns An Observable of DomainApiResponse.
//      */
//     addDomain(newDomain: Domain): Observable<domainApiResponse> {
//         return this.http.post<domainApiResponse>(`${this.apiUrl}/add-domain`, newDomain).pipe(
//             map(response => {
//                 if (response.status === 201) {
//                     console.log("The new Domain is added successfully", response.message);
//                     return response;
//                 } else {
//                     console.error("Error adding the new Domain:", response.message);
//                     throw new Error(response.message || "There is some error adding the new Domain");
//                 }
//             })
//         );
//     }

//     /**
//      * Updates an existing domain on the backend.
//      * Uses `oldDomainName` as the identifier in the URL path for the backend.
//      * @param oldDomainName The current domain name of the domain to update.
//      * @param updatedDomain The Domain object with the new data (its domainName might be updated).
//      * @returns An Observable of DomainApiResponse.
//      */
//     // updateDomain(oldDomainName: string, updatedDomain: Domain): Observable<domainApiResponse> {
//     //     return this.http.put<domainApiResponse>(`${this.apiUrl}/update/${oldDomainName}`, updatedDomain).pipe(
//     //         map(response => {
//     //             if (response.status === 200) {
//     //                 console.log(`Domain "${oldDomainName}" updated successfully:`, response.message);
//     //                 return response;
//     //             } else {
//     //                 console.error(`Error updating Domain "${oldDomainName}":`, response.message);
//     //                 throw new Error(response.message || `Error updating the Domain "${oldDomainName}"`);
//     //             }
//     //         })
//     //     );
//     // }

//     updateDomain(domainId: string, updatedDomain: String): Observable<domainApiResponse> {
//         return this.http.put<domainApiResponse>(`${this.apiUrl}/update/${domainId}`, updatedDomain).pipe(
//             map(response => {
//                 if (response.status === 200) { // Assuming 200 OK for successful update
//                     console.log(`Domain "${domainId}" updated successfully:`, response.message);
//                     return response;
//                 } else {
//                     console.error(`Error updating Domain "${domainId}":`, response.message);
//                     throw new Error(response.message || `Error updating the Domain "${domainId}"`);
//                 }
//             })
//         );
//     }

//     /**
//      * Deletes a domain from the backend.
//      * Uses `domainNameToDelete` as the identifier in the URL path for the backend.
//      * @param domainNameToDelete The domain name of the domain to delete.
//      * @returns An Observable of DomainApiResponse.
//      */
//     deleteDomain(domainNameToDelete: string): Observable<domainApiResponse> {
//         return this.http.delete<domainApiResponse>(`${this.apiUrl}/delete/${domainNameToDelete}`).pipe(
//             map(response => {
//                 if (response.status === 200) {
//                     console.log(`Domain "${domainNameToDelete}" deleted successfully:`, response.message);
//                     return response;
//                 } else {
//                     console.error(`Error deleting Domain "${domainNameToDelete}":`, response.message);
//                     throw new Error(response.message || `Error deleting the Domain "${domainNameToDelete}"`);
//                 }
//             })
//         );
//     }
// }
// src/app/services/domain.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Domain} from '../models/domain.model'; // Use your specific types
import { domainApiResponse } from '../models/ApiResponses.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  private baseUrl = `${environment.apiBaseUrl}/admin/domain`;

  constructor(private http: HttpClient) { }

  /**
   * Adds a new domain.
   * Assumes backend returns a standard {status, message} response, possibly with the new object in a 'domainName' field.
   * @param domain The domain object to add (domainId might be 0 or null for new).
   * @returns An Observable of any, representing the backend's raw response.
   */
  addDomain(domain: Domain): Observable<any> { // Using 'any' here as DomainApiResponse doesn't strictly fit singular responses
    return this.http.post<any>(`${this.baseUrl}/add-domain`, domain);
  }

  /**
   * Fetches all domains.
   * Directly uses DomainApiResponse which explicitly has 'domainNameList'.
   * @returns An Observable of Domain array.
   */
  fetchDomains(endpoint: string): Observable<Domain[]> {
    return this.http.get<domainApiResponse>(`${this.baseUrl}/${endpoint}`).pipe(
      map(response => {
        if (response.status === 200 && response.domainNameList) {
          return response.domainNameList;
        } else if (response.status === 404 && response.message === "No domains found.") {
          return [];
        }
        throw new Error(response.message || 'Failed to fetch domains: Unexpected response structure.');
      })
    );
  }

  /**
   * Fetches a domain by its name.
   * Assumes backend returns a response where the single Domain object is directly accessible
   * or within a field like 'domainName' (singular). We'll use 'any' for flexibility here
   * because DomainApiResponse doesn't have a singular 'domainName' field.
   * @param domainName The name of the domain to fetch.
   * @returns An Observable of Domain.
   */
  getDomainByName(domainName: string): Observable<Domain> {
    return this.http.get<any>(`${this.baseUrl}/name/${domainName}`).pipe(
      map(response => {
        // Assuming backend returns { status: ..., message: ..., domainName: { ... } } for single get
        if (response.status === 200 && response.domainName) {
          return response.domainName as Domain; // Cast to Domain
        }
        throw new Error(response.message || 'Domain not found: Unexpected response structure or status.');
      })
    );
  }

  /**
   * Updates an existing domain by its original name.
   * (Assumes backend uses PUT /api/domain/updateByName/{existingDomainName})
   * @param existingDomainName The current name of the domain to update (used in the path variable).
   * @param updatedDomain The Domain object containing the new domain details (including potentially a new name).
   * @returns An Observable of any, representing the backend's raw response.
   */
  updateDomain(existingDomainName: string, updatedDomain: Domain): Observable<any> { // Renamed from updateDomainByName to just updateDomain
    return this.http.put<any>(`${this.baseUrl}/updateByName/${existingDomainName}`, updatedDomain);
  }

  /**
   * Deletes a domain by its ID.
   * @param domainId The ID of the domain to delete.
   * @returns An Observable of any, representing the backend's raw response.
   */
  deleteDomain(domainId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${domainId}`);
  }
  deleteDomainName(domainName: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteByName/${domainName}`);
  }
}
