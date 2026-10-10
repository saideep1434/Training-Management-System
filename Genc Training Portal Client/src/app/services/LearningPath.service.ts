import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonCreateResponse, LearningPathApiResponse } from '../models/ApiResponses.model';
import { LearningPath, LearningPathByIdResponse, LearningPathOption, LearningPathOptionsResponse } from '../models/learningPath.model';
import { environment } from '../../environments/environment';


export interface LearningPathCreateResponse {
  status: number
  message: string
  learningPath: LearningPath
}

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {
  private learningPaths: LearningPath[] = [];
  private _learningPaths$ = new BehaviorSubject<LearningPath[]>(this.learningPaths);
  public  learningPaths$: Observable<LearningPath[]> = this._learningPaths$.asObservable();

  constructor(private http: HttpClient) {}

  private apiUrl : string = `${environment.apiBaseUrl}/learning-paths`;

  fetchLearningPaths(endpoint: string): Observable<LearningPathOption[]> {
    return this.http.get<LearningPathOptionsResponse>(`${this.apiUrl}/${endpoint}`).pipe(
      map(response => {
        if (response.status === 200 && response.learningPaths) {
          console.log("Learning paths fetched successfully", response.message);
          return response.learningPaths;
        } else {
          // This handles cases where the server responds with a non-200 status,
          // but the request itself was successful (e.g., a custom error status from your API)
          console.error("Server responded with an error status:", response.status, response.message);
          throw new Error(response.message || "Unknown error fetching learning paths");
        }
      }),
      catchError(error => {
        // This catches actual HTTP errors (network issues, 404, 500, etc.)
        console.error("HTTP error fetching learning paths:", error);
        // You can re-throw the error, return an empty array, or return a default value
        return throwError(() => new Error('Failed to fetch learning paths. Please try again later.'));
        // Or: return of([]); // To return an empty array and complete the observable
      })
    );
  }


  getLearningPaths(endpoint: string): Observable<LearningPathOption[]> {
    return this.http.get<LearningPathApiResponse>(`${this.apiUrl}/${endpoint}`).pipe(
      map(response => {
        if (response.status === 200 && response.learningPaths) {
          console.log("Learning paths fetched successfully", response.message);
          return response.learningPaths;
        } else {
          // This handles cases where the server responds with a non-200 status,
          // but the request itself was successful (e.g., a custom error status from your API)
          console.error("Server responded with an error status:", response.status, response.message);
          throw new Error(response.message || "Unknown error fetching learning paths");
        }
      }),
      catchError(error => {
        // This catches actual HTTP errors (network issues, 404, 500, etc.)
        console.error("HTTP error fetching learning paths:", error);
        // You can re-throw the error, return an empty array, or return a default value
        return throwError(() => new Error('Failed to fetch learning paths. Please try again later.'));
        // Or: return of([]); // To return an empty array and complete the observable
      })
    );
  }



  addLearningPath(endpoint: string, newPathData: LearningPath): Observable<LearningPath> {
    console.log(newPathData);
    return this.http.post<LearningPathCreateResponse>(`${this.apiUrl}/${endpoint}`, newPathData).pipe(
      map(response => {
        if(response.status === 201 && response.learningPath){
          console.log("The new Learning path is added successfully");
          return response.learningPath;
        }
        else{
          console.error("Error adding the new learning path");
          throw new Error("Error adding the new learning path");
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // This catches actual HTTP errors (e.g., network down, 404, 500 from server)
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          // Client-side or network error
          errorMessage = `Service: Client-side error: ${error.error.message}`;
        } else {
          // Backend returned an unsuccessful response code.
          errorMessage = `Service: Server returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
          // You might want to extract a specific message from error.error if your backend sends it
          if (error.error && error.error.message) {
            errorMessage = `Service: Server Error: ${error.status} - ${error.error.message}`;
          } else if (error.status === 400) {
            errorMessage = `Service: Validation Error: ${error.error.errors ? JSON.stringify(error.error.errors) : 'Bad Request'}`;
          }
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage)); // Re-throw for the component to handle
      })
    )
  }

  getLearningPathById(id: number): Observable<LearningPathOption> {
    // This constructs the URL to hit your backend endpoint:
    // GET http://localhost:8083/api/learning-paths/learningPath/{id}
    console.log(`LearningPathService: Fetching learning path with ID: ${id}`);
    return this.http.get<LearningPathByIdResponse>(`${this.apiUrl}/learningPath/${id}`).pipe(
      map(response => {
        if (response.status === 200 && response.learningPath) {
          console.log("Learning path fetched successfully", response.message);
          return response.learningPath;
        } else {
          // This handles cases where the server responds with a non-200 status,
          // but the request itself was successful (e.g., a custom error status from your API)
          console.error("Server responded with an error status:", response.status, response.message);
          throw new Error(response.message || "Unknown error fetching learning paths");
        }
      }),
      catchError(error => {
        // This catches actual HTTP errors (network issues, 404, 500, etc.)
        console.error("HTTP error fetching learning path:", error);
        // You can re-throw the error, return an empty array, or return a default value
        return throwError(() => new Error('Failed to fetch learning path. Please try again later.'));
        // Or: return of([]); // To return an empty array and complete the observable
      })
    );
  }

  updateLearningPath(learningPath: LearningPathOption): Observable<any> {
    const requestBody = {
      serviceLineName: learningPath.serviceLineName,
      totalDurationWeeks: this.calculateTotalDuration(learningPath.dayDetails),
      dayDetails: learningPath.dayDetails.map(day => ({
        dayNumber: day.dayNumber,
        topic: day.topic,
        description: day.description
      }))
    };

    return this.http.put<any>(
      `${this.apiUrl}/update/${learningPath.learningPathId}`,
      requestBody
    );
  }

  // Helper method to calculate total duration from dayDetails if needed
  private calculateTotalDuration(dayDetails: any[]): number {
    return dayDetails ? dayDetails.length : 0;
  }



  deleteLearningPath(id: number): void {
    const initialLength = this.learningPaths.length;
    // this.learningPaths = this.learningPaths.filter(lp => lp.id !== id);
    if (this.learningPaths.length < initialLength) {
      this._learningPaths$.next([...this.learningPaths]);
      this.saveToLocalStorage(); // Save after deleting
      console.log(`Learning Path with ID ${id} deleted and changes saved.`);
    } else {
      console.warn(`Learning Path with ID ${id} not found for deletion.`);
    }
  }

  private loadInitialData(): void {
    try {
      // const storedData = localStorage.getItem('learningPaths'); //
      this.getLearningPaths("basic-info");
      this._learningPaths$.next([...this.learningPaths]); // Ensure subscribers get the loaded data
    } catch (e) {
      console.error('Error loading or parsing data from localStorage:', e);
      // In case of an error, reset to an empty array or initial data to prevent app crash
      this.learningPaths = [];
      this._learningPaths$.next([]);
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('learningPaths', JSON.stringify(this.learningPaths)); //
    } catch (e) {
      console.error('Error saving data to localStorage:', e);
    }
  }
}

