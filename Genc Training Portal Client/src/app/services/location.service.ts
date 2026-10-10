
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Location, LocationApiResponse } from "../models/location.model";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    constructor(private http: HttpClient) {}

    private apiUrl: string = `${environment.apiBaseUrl}/location`;

    /**
     * Fetches all locations from the backend.
     * @param endpoint The specific endpoint for fetching all, e.g., "all-locations".
     * @returns An Observable of an array of Location objects.
     */
    fetchLocations(endpoint: string): Observable<Location[]> {
        return this.http.get<LocationApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
            map(response => {
                // Check if status is 200 and locationList is present
                if (response.status === 200 && response.locationList) {
                    console.log("Locations are fetched successfully", response.locationList);
                    return response.locationList;
                } else {
                    // Handle cases where status is not 200 or locationList is missing
                    console.error("Error fetching Locations:", response.message || "Unknown error");
                    throw new Error(response.message || "Error fetching the Locations");
                }
            })
        );
    }

    /**
     * Adds a new location to the backend.
     * @param endpoint The specific endpoint for adding, e.g., "add".
     * @param newLocation The Location object to be added.
     * @returns An Observable of LocationApiResponse.
     */
    addNewLocation(endpoint: string, newLocation: Location): Observable<LocationApiResponse> {
        return this.http.post<LocationApiResponse>(`${this.apiUrl}/${endpoint}`, newLocation).pipe(
            map(response => {
                if (response.status === 201) {
                    console.log("The new Location is added successfully", response.message);
                    return response; // Returns the { status, message } response
                } else {
                    console.error("Error adding the new Location:", response.message);
                    throw new Error(response.message || "There is some error adding the new Location");
                }
            })
        );
    }

    /**
     * Updates an existing location on the backend.
     * @param id The ID of the location to update.
     * @param updatedLocation The Location object with updated data.
     * @returns An Observable of LocationApiResponse.
     */
    updateLocation(id: number, updatedLocation: Location): Observable<LocationApiResponse> {
        return this.http.put<LocationApiResponse>(`${this.apiUrl}/update/${id}`, updatedLocation).pipe(
            map(response => {
                if (response.status === 200) { // Assuming 200 OK for successful update
                    console.log(`Location with ID ${id} updated successfully:`, response.message);
                    return response;
                } else {
                    console.error(`Error updating Location with ID ${id}:`, response.message);
                    throw new Error(response.message || `Error updating the Location with ID ${id}`);
                }
            })
        );
    }

    /**
     * Deletes a location from the backend.
     * @param id The ID of the location to delete.
     * @returns An Observable of LocationApiResponse.
     */
    deleteLocation(id: number): Observable<LocationApiResponse> {
        return this.http.delete<LocationApiResponse>(`${this.apiUrl}/delete/${id}`).pipe(
            map(response => {
                if (response.status === 200) { // Assuming 200 OK for successful delete
                    console.log(`Location with ID ${id} deleted successfully:`, response.message);
                    return response;
                } else {
                    console.error(`Error deleting Location with ID ${id}:`, response.message);
                    throw new Error(response.message || `Error deleting the Location with ID ${id}`);
                }
            })
        );
    }
}
