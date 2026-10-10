// src/app/pages/ui-components/add-cohort-dialog-component/add-cohort-dialog-component.component.ts

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatIconModule } from '@angular/material/icon';

// // Import Cohort class from the new model file
// import { Cohort } from '../../../../app/models/cohort.model'; // <--- UPDATED PATH

// @Component({
//   selector: 'app-add-cohort-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     MatChipsModule,
//     MatIconModule,
//     MatDialogModule // IMPORTANT: Keep this here for dialog elements like mat-dialog-content
//   ],
//   template: `
//     <h2 mat-dialog-title>Add New Cohort</h2>
//     <mat-dialog-content class="mat-typography">
//       <form [formGroup]="cohortForm">
//         <mat-form-field appearance="outline" class="w-100 mb-3">
//           <mat-label>Cohort ID</mat-label>
//           <input matInput formControlName="id" required>
//           <mat-error *ngIf="cohortForm.get('id')?.hasError('required') && cohortForm.get('id')?.touched">
//             Cohort ID is required.
//           </mat-error>
//         </mat-form-field>

//         <mat-form-field appearance="outline" class="w-100 mb-3">
//           <mat-label>Title</mat-label>
//           <input matInput formControlName="title" required>
//           <mat-error *ngIf="cohortForm.get('title')?.hasError('required') && cohortForm.get('title')?.touched">
//             Title is required.
//           </mat-error>
//         </mat-form-field>

//         <mat-form-field appearance="outline" class="w-100 mb-3">
//           <mat-label>Technology</mat-label>
//           <input matInput formControlName="technology" required>
//           <mat-error *ngIf="cohortForm.get('technology')?.hasError('required') && cohortForm.get('technology')?.touched">
//             Technology is required.
//           </mat-error>
//         </mat-form-field>

//         <mat-form-field appearance="outline" class="w-100 mb-3">
//           <mat-label>Tag</mat-label>
//           <input matInput formControlName="tag" required>
//           <mat-error *ngIf="cohortForm.get('tag')?.hasError('required') && cohortForm.get('tag')?.touched">
//             Tag is required.
//           </mat-error>
//         </mat-form-field>

//         <mat-form-field appearance="outline" class="w-100 mb-3">
//           <mat-label>Notifications</mat-label>
//           <input matInput type="number" formControlName="notifications" required>
//           <mat-error *ngIf="cohortForm.get('notifications')?.hasError('required') && cohortForm.get('notifications')?.touched">
//             Notifications is required.
//           </mat-error>
//           <mat-error *ngIf="cohortForm.get('notifications')?.hasError('min') && cohortForm.get('notifications')?.touched">
//             Notifications must be a positive number.
//           </mat-error>
//         </mat-form-field>

//         <mat-form-field appearance="outline" class="w-100 mb-3">
//           <mat-label>Filter By</mat-label>
//           <mat-select formControlName="filterBy" multiple>
//             <mat-option *ngFor="let option of filterByOptions" [value]="option.value">
//               {{option.label}}
//             </mat-option>
//           </mat-select>
//         </mat-form-field>

//         <mat-form-field appearance="outline" class="w-100 mb-3">
//           <mat-label>Vertical</mat-label>
//           <mat-select formControlName="vertical" multiple>
//             <mat-option *ngFor="let option of verticalOptions" [value]="option.value">
//               {{option.label}}
//             </mat-option>
//           </mat-select>
//         </mat-form-field>

//         <mat-form-field appearance="outline" class="w-100 mb-3">
//           <mat-label>Location</mat-label>
//           <mat-select formControlName="location" required>
//             <mat-option *ngFor="let option of locationOptions" [value]="option.value">
//               {{option.label}}
//             </mat-option>
//           </mat-select>
//           <mat-error *ngIf="cohortForm.get('location')?.hasError('required') && cohortForm.get('location')?.touched">
//             Location is required.
//           </mat-error>
//         </mat-form-field>

//         <mat-form-field appearance="outline" class="w-100 mb-3">
//           <mat-label>Status</mat-label>
//           <mat-select formControlName="status" required>
//             <mat-option *ngFor="let option of statusOptions" [value]="option.value">
//               {{option.label}}
//             </mat-option>
//           </mat-select>
//           <mat-error *ngIf="cohortForm.get('status')?.hasError('required') && cohortForm.get('status')?.touched">
//             Status is required.
//           </mat-error>
//         </mat-form-field>
//       </form>
//     </mat-dialog-content>
//     <mat-dialog-actions align="end">
//       <button mat-button (click)="onCancel()">Cancel</button>
//       <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="cohortForm.invalid">Add Cohort</button>
//     </mat-dialog-actions>
//   `,
//   styles: `
//     .w-100 { width: 100%; }
//     .mb-3 { margin-bottom: 1rem; }
//     .mat-dialog-content { max-height: 70vh; overflow-y: auto; }
//   `
// })
// export class AddCohortDialogComponent implements OnInit {
//   cohortForm!: FormGroup;

//   filterByOptions = [
//     { label: 'FTE', value: 'FTE' },
//     { label: 'Intern', value: 'Intern' },
//     { label: 'SOET', value: 'SOET' },
//     { label: 'Selenium', value: 'Selenium' },
//     { label: 'Playwright', value: 'Playwright' },
//     { label: 'CRM_Salesforce', value: 'CRM_Salesforce' },
//     { label: 'Facet', value: 'Facet' },
//   ];
//   verticalOptions = [
//     { label: 'HC/LS', value: 'HC/LS' },
//     { label: 'INS', value: 'INS' },
//     { label: 'BFS', value: 'BFS' },
//     { label: 'CMT', value: 'CMT' },
//     { label: 'NFT', value: 'NFT' },
//     { label: 'PNR', value: 'PNR' },
//     { label: 'Tech COE', value: 'Tech COE' },
//     { label: 'CRM', value: 'CRM' },
//     { label: 'HC', value: 'HC' },
//     { label: 'OGP', value: 'OGP' },
//   ];
//   locationOptions = [
//     { label: 'Chennai', value: 'Chennai' },
//     { label: 'Coimbatore', value: 'Coimbatore' },
//     { label: 'Bangalore', value: 'Bangalore' },
//     { label: 'Pune', value: 'Pune' },
//   ];
//   statusOptions = [
//     { label: 'In progress', value: 'In progress' },
//     { label: 'Upcoming', value: 'Upcoming' },
//     { label: 'Completed', value: 'Completed' },
//     { label: 'Deployed', value: 'Deployed' },
//   ];


//   constructor(
//     private fb: FormBuilder,
//     public dialogRef: MatDialogRef<AddCohortDialogComponent>
//   ) {}

//   ngOnInit(): void {
//     this.cohortForm = this.fb.group({
//       id: ['', Validators.required],
//       title: ['', Validators.required],
//       technology: ['', Validators.required],
//       tag: ['', Validators.required],
//       notifications: [0, [Validators.required, Validators.min(0)]],
//       filterBy: [[]],
//       vertical: [[]],
//       location: ['', Validators.required],
//       status: ['', Validators.required],
//     });
//   }

//   onCancel(): void {
//     this.dialogRef.close();
//   }

//   onSubmit(): void {
//     if (this.cohortForm.valid) {
//       const newCohort: Cohort = this.cohortForm.value; // The form returns a plain object that matches Cohort structure
//       this.dialogRef.close(newCohort); // Pass the plain object data back
//     } else {
//       this.cohortForm.markAllAsTouched();
//     }
//   }
// }

// src/app/pages/ui-components/add-cohort-dialog-component/add-cohort-dialog-component.component.ts

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// // Import Cohort class from the new model file
// import { Cohort } from '../../../../../app/models/class/cohort.model';

// @Component({
//   selector: 'app-add-cohort-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     MatChipsModule,
//     MatIconModule,
//     MatDialogModule,
//     MatDatepickerModule,
//     MatInputModule,
//     MatNativeDateModule, 
//   ],
//   templateUrl: './add-cohort-dialog-component.component.html', // <--- CHANGED HERE
//   styleUrls: ['./add-cohort-dialog-component.component.scss'] // <--- NEW STYLESHEET
// })
// export class AddCohortDialogComponent implements OnInit {
//   cohortForm!: FormGroup;

//   filterByOptions = [
//     { label: 'FTE', value: 'FTE' },
//     { label: 'Intern', value: 'Intern' },
//     { label: 'SOET', value: 'SOET' },
//     { label: 'Selenium', value: 'Selenium' },
//     { label: 'Playwright', value: 'Playwright' },
//     { label: 'CRM_Salesforce', value: 'CRM_Salesforce' },
//     { label: 'Facet', value: 'Facet' },
//   ];
//   verticalOptions = [
//     { label: 'HC/LS', value: 'HC/LS' },
//     { label: 'INS', value: 'INS' },
//     { label: 'BFS', value: 'BFS' },
//     { label: 'CMT', value: 'CMT' },
//     { label: 'NFT', value: 'NFT' },
//     { label: 'PNR', value: 'PNR' },
//     { label: 'Tech COE', value: 'Tech COE' },
//     { label: 'CRM', value: 'CRM' },
//     { label: 'HC', value: 'HC' },
//     { label: 'OGP', value: 'OGP' },
//   ];
//   locationOptions = [
//     { label: 'Chennai', value: 'Chennai' },
//     { label: 'Coimbatore', value: 'Coimbatore' },
//     { label: 'Bangalore', value: 'Bangalore' },
//     { label: 'Pune', value: 'Pune' },
//   ];
//   statusOptions = [
//     { label: 'In progress', value: 'In progress' },
//     { label: 'Upcoming', value: 'Upcoming' },
//     { label: 'Completed', value: 'Completed' },
//     { label: 'Deployed', value: 'Deployed' },
//   ];


//   constructor(
//     private fb: FormBuilder,
//     public dialogRef: MatDialogRef<AddCohortDialogComponent>
//   ) {}

//   ngOnInit(): void {
//     this.cohortForm = this.fb.group({
//       id: ['', Validators.required],
//       title: ['', Validators.required],
//       technology: ['', Validators.required],
//       tag: ['', Validators.required],
//       notifications: [0, [Validators.required, Validators.min(0)]],
//       filterBy: [[]],
//       vertical: [[]],
//       location: ['', Validators.required],
//       status: ['', Validators.required],
//     });
//   }

//   onCancel(): void {
//     this.dialogRef.close();
//   }

//   onSubmit(): void {
//     if (this.cohortForm.valid) {
//       const newCohort: Cohort = this.cohortForm.value;
//       this.dialogRef.close(newCohort);
//     } else {
//       this.cohortForm.markAllAsTouched();
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Import Cohort class from the new model file
import { Cohort } from '../../models/class/cohort.model';
import { Observable } from 'rxjs';
import { CohortService } from 'src/app/services/cohort.service';
import { LearningPathOption } from 'src/app/models/learningPath.model';
import { ServiceLine } from 'src/app/models/serviceLine.model';


interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'app-add-cohort-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './add-cohort-dialog-component.component.html',
  styleUrls: ['./add-cohort-dialog-component.component.scss'],
  providers: [DatePipe]
})
export class AddCohortDialogComponent implements OnInit {
  cohortForm!: FormGroup;

  filterByOptions: { label: string; value: string }[] = [];
  verticalOptions: { label: string; value: string }[] = [];
  locationOptions: { label: string; value: string }[] = [];
  techTrainerOptions: { label: string; value: string }[] = [];
  bhTrainerOptions: { label: string; value: string }[] = [];
  coachOptions: { label: string; value: string }[] = [];
  serviceLinesOptions : ServiceLine[] = [];
  mentorOptions : {label: string, value: string }[] = [];
  domainOptions : {label: string, value: string }[] = [];
  hiretypesoptions: {label: string, value: string }[] = [];
  LearningPathOptions: LearningPathOption[] = [];

  isLoading = true;

 
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCohortDialogComponent>,
    private cohortService: CohortService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchFormOptions();

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // console.log("clikkkkkkk")
    // console.log(this.cohortForm.value);
    if (this.cohortForm.valid) {
      
      const rawValue = this.cohortForm.value; // rawValue.dateOfJoining is a Date object

    // Construct the object that matches your `Cohort` class/interface
    const cohortDataToSend: Cohort = { // Explicitly type it as Cohort
      cohortId: rawValue.cohortId, // Assuming you have these fields in your form
      cohortCode: rawValue.cohortCode,
      domainName: rawValue.domainName,
      technicalTrainerName: rawValue.technicalTrainerName,
      coachName: rawValue.coachName,
      mentorName: rawValue.mentorName,
      bhTrainerName: rawValue.bhTrainerName,
      location: rawValue.location,
      hireType: rawValue.hireType,
      vertical: rawValue.vertical,
      serviceLine: rawValue.serviceLine,
      learningPathId: rawValue.learningPathId, // Ensure learningPathId is handled correctly (string vs number)

      // These are transformed into 'yyyy-MM-dd' strings
      dateOfJoining: this.datePipe.transform(rawValue.dateOfJoining, 'yyyy-MM-dd')!, // ! asserts non-null
      trainingStartDate: this.datePipe.transform(rawValue.trainingStartDate, 'yyyy-MM-dd')!,
      trainingEndDate: this.datePipe.transform(rawValue.trainingEndDate, 'yyyy-MM-dd')!
    };

      
      this.dialogRef.close(cohortDataToSend);
    } else {
      this.cohortForm.markAllAsTouched();
    }
  }

  private initializeForm() : void {
    this.cohortForm = this.fb.group({
      cohortId: ['', Validators.required],
      cohortCode: ['', Validators.required],
      domainName: ['', Validators.required],
      technicalTrainerName: ['', Validators.required],
      coachName: ['', Validators.required],
      mentorName: ['', Validators.required],
      bhTrainerName: ['', Validators.required],
      location: ['', Validators.required],
      hireType: [null, Validators.required],
      vertical: ['', Validators.required],
      serviceLine: ['', Validators.required],
      learningPathId: [null, Validators.required],
      dateOfJoining: [new Date(), Validators.required], 
      trainingStartDate: [new Date(), Validators.required],
      trainingEndDate: [new Date(), Validators.required],
    });
  }

  private fetchFormOptions() : void {
    this.isLoading = true;

    Promise.all([
      this.fetchLocations(),
      this.fetchHireTypes(), 
      this.fetchTechnicalTrainers(),
      this.fetchBHTrainers(),
      this.fetchCoaches(),
      this.fetchVerticals(),
      this.fetchMentors(),
      this.fetchDomains(),
      this.fetchLearninPathOptions(),
      this.fetchServiceLines()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  fetchTechnicalTrainers(): Promise<void> {
    // Return a new Promise that will resolve or reject based on the Observable's outcome
    return new Promise<void>((resolve, reject) => {
      // 1. Call the CohortService method, which internally uses techTrainerService
      // and transforms TechTrainer[] to Option[]
      this.cohortService.fetchTechnicalTrainers().subscribe({
        next: (data: Option[]) => {
          // This 'data' is already the transformed Option[]
          this.techTrainerOptions = data; // Assign the data to your component property
          console.log("Tech trainer options successfully set:", this.techTrainerOptions);
          resolve(); // Resolve the promise on successful data assignment
        },
        error: (error: any) => {
          console.error('Error fetching technical trainers in component:', error);
          reject(error); // Reject the promise on error
        },
        complete: () => {
          console.log('Technical trainers observable completed.');
          // If you want the promise to resolve on complete even if data isn't guaranteed
          // to be 'nexted', you could put resolve() here, but typically it's in 'next'.
        }
      });
    })}

    fetchBHTrainers(): Promise<void> {
      // Return a new Promise that will resolve or reject based on the Observable's outcome
      return new Promise<void>((resolve, reject) => {
        // 1. Call the CohortService method, which internally uses techTrainerService
        // and transforms TechTrainer[] to Option[]
        this.cohortService.fetchBHTrainers().subscribe({
          next: (data: Option[]) => {
            // This 'data' is already the transformed Option[]
            this.bhTrainerOptions = data; // Assign the data to your component property
            console.log("BH options successfully set:", this.bhTrainerOptions);
            resolve(); // Resolve the promise on successful data assignment
          },
          error: (error: any) => {
            console.error('Error fetching BH Trainers in component:', error);
            reject(error); // Reject the promise on error
          },
          complete: () => {
            console.log('BH trainers observable completed.');
            // If you want the promise to resolve on complete even if data isn't guaranteed
            // to be 'nexted', you could put resolve() here, but typically it's in 'next'.
          }
        });
      })}

      fetchCoaches(): Promise<void> {
        // Return a new Promise that will resolve or reject based on the Observable's outcome
        return new Promise<void>((resolve, reject) => {
          // 1. Call the CohortService method, which internally uses techTrainerService
          // and transforms TechTrainer[] to Option[]
          this.cohortService.fetchCoaches().subscribe({
            next: (data: Option[]) => {
              // This 'data' is already the transformed Option[]
              this.coachOptions = data; // Assign the data to your component property
              console.log("Coach options successfully set:", this.coachOptions);
              resolve(); // Resolve the promise on successful data assignment
            },
            error: (error: any) => {
              console.error('Error fetching Coaches in component:', error);
              reject(error); // Reject the promise on error
            },
            complete: () => {
              console.log('Coaches observable completed.');
              // If you want the promise to resolve on complete even if data isn't guaranteed
              // to be 'nexted', you could put resolve() here, but typically it's in 'next'.
            }
          });
        })}

        fetchMentors(): Promise<void> {
          // Return a new Promise that will resolve or reject based on the Observable's outcome
          return new Promise<void>((resolve, reject) => {
            // 1. Call the CohortService method, which internally uses techTrainerService
            // and transforms TechTrainer[] to Option[]
            this.cohortService.fetchMentors().subscribe({
              next: (data: Option[]) => {
                // This 'data' is already the transformed Option[]
                this.mentorOptions = data; // Assign the data to your component property
                console.log("Mentor options successfully set:", this.mentorOptions);
                resolve(); // Resolve the promise on successful data assignment
              },
              error: (error: any) => {
                console.error('Error fetching Mentor in component:', error);
                reject(error); // Reject the promise on error
              },
              complete: () => {
                console.log('Mentor observable completed.');
                // If you want the promise to resolve on complete even if data isn't guaranteed
                // to be 'nexted', you could put resolve() here, but typically it's in 'next'.
              }
            });
          })}

      fetchLocations(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
          this.cohortService.fetchLocations().subscribe ({
            next: (data: Option[]) => {
              this.locationOptions = data;
              console.log("Location options fetched successfuly", this.locationOptions);
            },
            error: (error: any) => {
              console.log("Error fetching Locations in component", error);
            },
            complete: () => {
              console.log("Location fetched successfully");
            }
          })
        })
      }

      fetchDomains(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
          this.cohortService.fetchDomains().subscribe ({
            next: (data: Option[]) => {
              this.domainOptions = data;
              console.log("Domain options fetched successfuly", this.domainOptions);
            },
            error: (error: any) => {
              console.log("Error fetching domains in component", error);
            },
            complete: () => {
              console.log("domains fetched successfully");
            }
          })
        })
      }

      fetchVerticals(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
          this.cohortService.fetchVerticals().subscribe ({
            next: (data: Option[]) => {
              this.verticalOptions = data;
              console.log("vertical options fetched successfuly", this.verticalOptions);
            },
            error: (error: any) => {
              console.log("Error fetching verticals in component", error);
            },
            complete: () => {
              console.log("verticals fetched successfully");
            }
          })
        })
      }

      fetchHireTypes(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
          this.cohortService.fetchHireTypes().subscribe ({
            next: (data: Option[]) => {
              this.hiretypesoptions = data;
              console.log("Hire types options fetched successfuly", this.hiretypesoptions);
            },
            error: (error: any) => {
              console.log("Error fetching Hire Types in component", error);
            },
            complete: () => {
              console.log("Hire Types fetched successfully");
            }
          })
        })
      }

      fetchLearninPathOptions(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
          this.cohortService.fetchLearningPaths().subscribe ({
            next: (data: LearningPathOption[]) => {
              this.LearningPathOptions = data;
              console.log("Learning Path options fetched successfuly", this.LearningPathOptions);
            },
            error: (error: any) => {
              console.log("Error fetching Learning Paths in component", error);
            },
            complete: () => {
              console.log("Leanring paths fetched successfully");
            }
          })
        })
      }

      fetchServiceLines(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
          this.cohortService.fetchServiceLines().subscribe ({
            next: (data: ServiceLine[]) => {
              this.serviceLinesOptions = data;
              console.log("Service Lines options fetched successfuly", this.serviceLinesOptions);
            },
            error: (error: any) => {
              console.log("Error fetching service lines in component", error);
            },
            complete: () => {
              console.log("Service Lines fetched successfully");
            }
          })
        })
      }

}