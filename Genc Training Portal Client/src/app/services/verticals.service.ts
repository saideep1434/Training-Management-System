


import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { vertical, verticalApiResponse } from "../models/vertical.model";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VerticalService {

    constructor(private http: HttpClient) {}

    private apiUrl: string = `${environment.apiBaseUrl}/verticals`;

    /**
     * Fetches all verticals from the backend.
     * Expected backend response for "all-verticals": { status: 200, message: "...", verticalList: [...] }
     * @returns An Observable of an array of Vertical objects.
     */
    // fetchAllVerticals(): Observable<vertical[]> {
    //     return this.http.get<verticalApiResponse>(`${this.apiUrl}/all-verticals`).pipe(
    //         map(response => {
    //             // Check if status is 200 and verticalList is present
    //             if (response.status === 200 && response.verticalList) {
    //                 console.log("Verticals are fetched successfully", response.verticalList);
    //                 return response.verticalList;
    //             } else {
    //                 // Handle cases where status is not 200 or verticalList is missing
    //                 console.error("Error fetching Verticals:", response.message || "Unknown error");
    //                 throw new Error(response.message || "Error fetching the Verticals");
    //             }
    //         })
    //     );
    // }
    fetchVerticals(endpoint : string) : Observable<vertical[]>{
                return this.http.get<verticalApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
                    map(response => {
                        if(response.status == 200 && response.verticalList){
                            console.log("verticals are fetched successfully", response.verticalList);
                            return response.verticalList;
                        }
                        else{
                            console.error("Error fetching verticals", response.message);
                            throw new Error("Error fetching the verticals");
                        }
                    })
                )
            }

    /**
     * Adds a new vertical to the backend.
     * Expected backend response for "add": { status: 201, message: "...", vertical?: Vertical }
     * @param newVertical The Vertical object to be added (verticalId is typically ignored by backend for add).
     * @returns An Observable of VerticalApiResponse.
     */
    addVertical(newVertical: vertical): Observable<verticalApiResponse> {
        return this.http.post<verticalApiResponse>(`${this.apiUrl}/add`, newVertical).pipe(
            map(response => {
                if (response.status === 201) { // Assuming 201 Created for successful addition
                    console.log("The new Vertical is added successfully", response.message);
                    return response; // Returns the { status, message } response
                } else {
                    console.error("Error adding the new Vertical:", response.message);
                    throw new Error(response.message || "There is some error adding the new Vertical");
                }
            })
        );
    }

    /**
     * Updates an existing vertical on the backend.
     * Expected backend response for "update/{id}": { status: 200, message: "...", vertical?: Vertical }
     * @param id The ID of the vertical to update.
     * @param updatedVertical The Vertical object with updated data.
     * @returns An Observable of VerticalApiResponse.
     */
    updateVertical(id: string, updatedVertical: vertical): Observable<verticalApiResponse> {
        // Assuming backend endpoint is /api/verticals/update/{id}
        return this.http.put<verticalApiResponse>(`${this.apiUrl}/update/${id}`, updatedVertical).pipe(
            map(response => {
                if (response.status === 200) { // Assuming 200 OK for successful update
                    console.log(`Vertical with ID ${id} updated successfully:`, response.message);
                    return response;
                } else {
                    console.error(`Error updating Vertical with ID ${id}:`, response.message);
                    throw new Error(response.message || `Error updating the Vertical with ID ${id}`);
                }
            })
        );
    }

    /**
     * Deletes a vertical from the backend.
     * Expected backend response for "delete/{id}": { status: 200, message: "..." }
     * @param id The ID of the vertical to delete.
     * @returns An Observable of VerticalApiResponse.
     */
    deleteVertical(id: string): Observable<verticalApiResponse> {
        // Assuming backend endpoint is /api/verticals/delete/{id}
        return this.http.delete<verticalApiResponse>(`${this.apiUrl}/delete/${id}`).pipe(
            map(response => {
                if (response.status === 200) { // Assuming 200 OK for successful delete
                    console.log(`Vertical with ID ${id} deleted successfully:`, response.message);
                    return response;
                } else {
                    console.error(`Error deleting Vertical with ID ${id}:`, response.message);
                    throw new Error(response.message || `Error deleting the Vertical with ID ${id}`);
                }
            })
        );
    }
}
