import { HttpClient, HttpErrorResponse } from "@angular/common/http"; // Import HttpErrorResponse
import { Injectable, OnInit } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs"; // Import throwError
import { AddAssociateApiResponse, CommonCreateResponse, PersonApiResponse } from "../models/ApiResponses.model";
import { Associate } from "../models/Person.model";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService { // Removed OnInit as it's not typically used for services without lifecycle hooks

  private apiUrl = `${environment.apiBaseUrl}/admin/associate`;

  constructor(private http: HttpClient) {
  }

  // ngOnInit() is for components/directives, not typically services. Remove it.
  // ngOnInit(): void {
  // }

  addUser(endpoint: string, associate: Associate): Observable<Associate> {
    console.log("this is geting called");
    return this.http.post<AddAssociateApiResponse>(`${this.apiUrl}/${endpoint}`, associate)
      .pipe(
        map(response => {
          // Check for a successful status code (e.g., 200 OK or 201 Created)
          console.log(response.message, response.status);
          if (response.status === 200 || response.status === 201) {
            // Directly return the 'registeredAssociate' from the response
            console.log("added user successfully", response.message);
            return response.registeredAssociate;
          } else {
            // Handle other non-successful status codes explicitly
            console.error('addUser: API returned an unexpected status:', response);
            throw new Error(response.message || 'Failed to add user with an unexpected status.');
          }
        }),
        catchError(error => {
          // This block handles actual HTTP errors (e.g., network issues, 4xx/5xx responses)
          console.error('addUser: HTTP Error occurred:', error);
          let errorMessage = 'An unknown error occurred!';
          if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Backend error
            // Check if the backend sends a specific error message in the error body
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
          }
          // Re-throw the error so the calling component can handle it
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  deleteUser(endpoint: string, Id: string): Observable<CommonCreateResponse> {
    return this.http.delete<CommonCreateResponse>(`${this.apiUrl}/${endpoint}/${Id}`).pipe(
      map(response => {
        if (response.status === 200) {
          console.log("Deleted user successfully", response.message);
          return response;
        }
        else {
          throw new Error("Error deleting the user");
        }
      }),
      catchError(error => {
        console.error('addUser: HTTP Error occurred:', error);
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          // Client-side or network error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Backend error
          // Check if the backend sends a specific error message in the error body
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
        }
        // Re-throw the error so the calling component can handle it
        return throwError(() => new Error(errorMessage));
      })
    )
  }

  fetchAllUsers(endpoint: string): Observable<Associate[]> {
    return this.http.get<PersonApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
      map(response => {
        if (response.status === 200 && response.registeredAssociates) {
          console.log("User details have been fetched successfully from API.", response.registeredAssociates);
          return response.registeredAssociates;
        } else {
          // This block handles cases where the API returns a 200 OK, but with an internal application error status
          console.error("API returned non-200 status in response body:", response.status, response.message);
          throw new Error(response.message || "Error fetching user details from API response.");
        }
      }),
      // Add catchError to handle HTTP errors (e.g., 404, 500)
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred.
          errorMessage = `Client-side error: ${error.error.message}`;
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          errorMessage = `Server returned code ${error.status}: ${error.error?.message || error.message}`;
        }
        console.error(errorMessage);
        // Re-throw the error to be caught by the component's subscribe error handler
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateUser(endpoint: string, id: string, associate: Associate): Observable<Associate> {
    console.log("updateUser method called for ID:", id, "with data:", associate);
    // Your backend's update endpoint typically includes the ID in the URL
    // e.g., /api/associates/{id}
    return this.http.put<AddAssociateApiResponse>(`${this.apiUrl}/${endpoint}/${id}`, associate)
      .pipe(
        map(response => {
          console.log("Update API Response:", response.message, response.status);
          if (response.status === 200) { // Backend returns HttpStatus.OK.value() (200) for updates
            console.log("User updated successfully:", response.message);
            return response.registeredAssociate; // Return the updated associate from the backend
          } else {
            console.error('updateUser: API returned an unexpected status:', response);
            throw new Error(response.message || 'Failed to update user with an unexpected status.');
          }
        }),
        catchError(error => {
          console.error('updateUser: HTTP Error occurred:', error);
          let errorMessage = 'An unknown error occurred!';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error) { // Try to get message from error.error if it's an object
              try {
                const parsedError = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
                if (parsedError.message) {
                  errorMessage = parsedError.message;
                }
              } catch (e) {
                // If parsing fails, use generic message
              }
            }
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
