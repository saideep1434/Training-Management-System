import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AppCardComponent } from "../../components/card/card.component";
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

// Import the new dialog component
import { DialogComponent } from '../../components/add-trainer/add-trainer.component';
import { MentorService } from 'src/app/services/mentor.service'; // Ensure correct path to your MentorService
import { Mentor, MentorAdd } from 'src/app/models/Mentor.model'; // Ensure correct path to your Mentor models
import { CommonCreateResponse } from 'src/app/models/ApiResponses.model'; // Ensure correct path to your API Responses model


@Component({
  selector: 'app-tables', // Check if this selector is correct for your application structure
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatPaginator,
    AppCardComponent,
  ],
  templateUrl: './mentor.component.html', // Make sure this path is correct
})
export class AppMentorComponent implements OnInit, AfterViewInit, OnDestroy {
  // Define the columns that will be displayed in the Angular Material table
  displayedColumns1: string[] = [
    'serialNumber',
    'name',
    'associateId',
    'domain',
    'email',
    'cohorts',
    'actions',
  ];

  // Initialize MatTableDataSource with an array of Mentor Data.
  dataSource1 = new MatTableDataSource<Mentor>();

  // Property to hold the search term entered by the user for filtering trainers
  trainerSearchTerm: string = ''; // Keeping 'trainerSearchTerm' for consistency with previous components

  // Use @ViewChild to get a reference to the MatPaginator component in the template.
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Use a Subscription object to manage and unsubscribe from dialog subscriptions
  private subscriptions = new Subscription();

  // Properties to display in the app-card components - these will be dynamically set
  totalTrainers: number = 0; // Renamed from totalMentors to match card naming
  assignedTrainers: number = 0; // Renamed from assignedMentors
  freeTrainers: number = 0; // Renamed from freeMentors

  // Added for better UX (optional, but good practice)
  isLoading: boolean = true;
  errorMessage: string = '';

  // Inject MatDialog service for opening dialogs
  constructor(private dialog: MatDialog, private mentorService: MentorService) { }

  ngOnInit(): void {
    // Load data and calculate counts immediately on component initialization
    this.loadMentorDetails();

    // Define a custom filter predicate for the MatTableDataSource.
    // This allows you to specify how the filtering should be performed.
    this.dataSource1.filterPredicate = (data: Mentor, filter: string) => {
      // Ensure mentorAssociateId is handled as string for filtering
      // Adding a null check for safety
      return data.mentorAssociateId?.toString().toLowerCase().includes(filter);
    };
  }

  /**
   * Fetches Mentor details and updates table data and all counts.
   */
  loadMentorDetails(): void {
    this.isLoading = true; // Set loading state
    this.errorMessage = ''; // Clear any previous error messages

    // Using your existing service method: fetchMetorDetails
    this.mentorService.fetchMetorDetails("all-mentors").subscribe({
      next: (mentors: Mentor[]) => { // Assuming this directly returns an array of Mentor
        this.dataSource1 = new MatTableDataSource<Mentor>(mentors);

        // IMPORTANT: Re-assign paginator to the new MatTableDataSource instance
        if (this.paginator) {
          this.dataSource1.paginator = this.paginator;
        }
        // If you have MatSort, assign it here too:
        // if (this.sort) {
        //   this.dataSource1.sort = this.sort;
        // }

        // *******************************************************************
        // DYNAMICALLY CALCULATE COUNTS HERE
        // *******************************************************************
        this.totalTrainers = mentors.length; // Uses the fetched array length

        // IMPORTANT: These calculations for assigned and free trainers
        // depend on your 'Mentor' model having a 'status' field (or similar).
        // If your Mentor model does NOT have a 'status' field that indicates
        // 'assigned' or 'free' (e.g., 'status?: 'assigned' | 'free';'),
        // then these lines will not work as intended, and you'll need to define
        // how "assigned" vs. "free" is determined from your data.
        // For mentors, 'cohorts' might indicate assignment.
        // Example if 'status' exists:
        this.assignedTrainers = mentors.filter(mentor => mentor.status === 'assigned').length;
        this.freeTrainers = mentors.filter(mentor => mentor.status === 'free').length;
        // Example if based on cohorts (assuming 0 cohorts means free):
        // this.assignedTrainers = mentors.filter(mentor => mentor.cohorts > 0).length;
        // this.freeTrainers = mentors.filter(mentor => mentor.cohorts === 0).length;


        this.isLoading = false; // Turn off loading state
        console.log("Mentor details fetched successfully. Total:", this.totalTrainers,
          "Assigned:", this.assignedTrainers, "Free:", this.freeTrainers);
      },
      error: (err: any) => {
        this.isLoading = false; // Turn off loading state even on error
        this.errorMessage = 'Failed to load mentors. Please check the console for details.';
        console.error('AppMentorComponent: Error fetching mentors:', err);
      },
      complete: () => {
        console.log('AppMentorComponent: Mentor fetch completed.');
      }
    });
  }

  ngAfterViewInit(): void {
    // Assign the MatPaginator instance to the dataSource's paginator property.
    // This is called once after the view is initialized.
    // Also assigned in loadMentorDetails to handle new data source instances.
    if (this.paginator) {
      this.dataSource1.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  /**
   * Applies the filter based on the 'trainerSearchTerm' input.
   */
  applyTrainerFilter(): void {
    const filterValue = this.trainerSearchTerm.trim().toLowerCase();
    this.dataSource1.filter = filterValue;

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  /**
   * Opens the AddTrainerDialogComponent to add a new mentor.
   */
  addTrainer(): void { // Keeping 'addTrainer' as method name
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      disableClose: true,
      data: { role: 'mentor' } // Passing the role to the dialog box component
    });

    // Subscribe to the dialog's afterClosed() observable to get data when it's closed
    this.subscriptions.add(dialogRef.afterClosed().subscribe((result: any | undefined) => {
      if (result) {
        console.log("Result received:", result);

        const mentorToAdd: MentorAdd = {
          mentorAssociateId: result.mentorAssociateId,
          mentorEmail: result.mentorEmail,
          mentorName: result.mentorName
        };

        console.log("NEW mentor to be added:", mentorToAdd);

        // Using your existing service method: addNewMentor
        this.mentorService.addNewMentor("add", mentorToAdd).subscribe({
          next: (response: CommonCreateResponse) => {
            // Use strict comparison (===) and check for common success codes (200, 201)
            if (response.status === 200 || response.status === 201) {
              console.log("Mentor details added successfully", response.message);
              // IMPORTANT: Reload the data after a successful addition
              // This will update the table and all the counts dynamically.
              this.loadMentorDetails();
            } else {
              console.error("Error adding the mentor:", response.message);
              this.errorMessage = response.message || 'Failed to add mentor.';
              // TODO: Consider showing a user-friendly notification (e.g., MatSnackBar)
            }
          },
          error: (err: any) => {
            console.error('Error adding the mentor:', err);
            this.errorMessage = 'An error occurred while adding the mentor. Please try again.';
            // TODO: Consider showing a user-friendly notification
          }
        });
      } else {
        console.log('Dialog closed without adding a mentor.');
      }
    }));
  }
}