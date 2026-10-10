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
import { Observable, Subscription, take } from 'rxjs'; // Keep take for future use if needed
import { TechTrainer, TechTrainerAdd } from 'src/app/models/TechTrainer.model';

// Import the new dialog component
import { DialogComponent } from 'src/app/components/add-trainer/add-trainer.component';
import { TechnicalTrainerService } from 'src/app/services/trainer.service'; // Ensure correct service path
import { AddAssociateApiResponse, CommonCreateResponse } from 'src/app/models/ApiResponses.model';
import { Associate } from 'src/app/models/Person.model';

@Component({
  selector: 'app-tables',
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
  templateUrl: './tech-trainer.component.html', // Ensure this path is correct
})
export class AppTechTrainerComponent implements OnInit, AfterViewInit, OnDestroy {
  // Define the columns that will be displayed in the Angular Material table
  displayedColumns1: string[] = [
    'serialNumber',
    'name',
    'associateId',
    'description',
    'status', // Assuming 'status' is a column you want to display
    'email',
    'cohorts',
    'actions',
  ];

  // Note: trainer1 property isn't used for adding, the dialog result directly forms TechTrainerAdd
  // You can remove this property if it's truly not used.
  trainer1: TechTrainerAdd;

  // Initialize MatTableDataSource with an array of TechnicalTrainersData.
  dataSource1 = new MatTableDataSource<TechTrainer>();

  // Property to hold the search term entered by the user for filtering trainers
  trainerSearchTerm: string = '';

  // Use @ViewChild to get a reference to the MatPaginator component in the template.
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Use a Subscription object to manage and unsubscribe from dialog subscriptions
  private subscriptions = new Subscription();

  // Properties to display in the app-card components
  totalTrainers: number = 0;
  assignedTrainers: number = 0;
  freeTrainers: number = 0;

  // Added for better UX (optional, but good practice)
  isLoading: boolean = true;
  errorMessage: string = '';

  // Inject MatDialog service for opening dialogs
  constructor(private dialog: MatDialog, private TechTrainerService: TechnicalTrainerService) {
    // Initialize in constructor or ngOnInit (only if it's used somewhere else,
    // otherwise you can remove the trainer1 property if the dialog result is used directly)
    this.trainer1 = { // Initialize with default or empty values
      techTrainerAssociateId: '',
      techTrainerName: '',
      techTrainerEmail: '',
      description: ''
    };
  }

  ngOnInit(): void {
    // Load data and calculate counts immediately on component initialization
    this.loadTechnicalTrainers();

    // Define a custom filter predicate for the MatTableDataSource.
    // This allows you to specify how the filtering should be performed.
    this.dataSource1.filterPredicate = (data: TechTrainer, filter: string) => {
      // Assuming 'techTrainerAssociateId' is the field you want to filter by
      // Adding a null check for safety
      return data.techTrainerAssociateId?.toString().toLowerCase().includes(filter);
    };
  }

  /**
   * Fetches Technical Trainer details and updates table data and all counts.
   */
  loadTechnicalTrainers(): void {
    this.isLoading = true; // Set loading state
    this.errorMessage = ''; // Clear any previous error messages

    // Using your existing service method: fetchTechTrainerDetails
    this.TechTrainerService.fetchTechTrainerDetails("all-tech-trainers")
      .subscribe({
        next: (trainers: TechTrainer[]) => { // Assuming this directly returns an array of TechTrainer
          this.dataSource1 = new MatTableDataSource<TechTrainer>(trainers);

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
          this.totalTrainers = trainers.length;
          // These lines depend on the 'status' property in your TechTrainer model.
          this.assignedTrainers = trainers.filter(t => t.status === 'assigned').length;
          this.freeTrainers = trainers.filter(t => t.status === 'free').length;

          this.isLoading = false; // Turn off loading state
          console.log('TechTrainerListComponent: Successfully loaded trainers:', this.dataSource1.data);
          console.log("Total Tech Trainers:", this.totalTrainers,
            "Assigned Tech Trainers:", this.assignedTrainers,
            "Free Tech Trainers:", this.freeTrainers);
        },
        error: (err: any) => {
          this.isLoading = false; // Turn off loading state even on error
          this.errorMessage = 'Failed to load technical trainers. Please check the console for details.';
          console.error('TechTrainerListComponent: Error fetching technical trainers:', err);
        },
        complete: () => {
          console.log('TechTrainerListComponent: Technical trainers fetch completed.');
        }
      });
  }


  ngAfterViewInit(): void {
    // Assign the MatPaginator instance to the dataSource's paginator property.
    // This is called once after the view is initialized.
    // Also assigned in loadTechnicalTrainers to handle new data source instances.
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
   * Opens the AddTrainerDialogComponent to add a new trainer.
   */
  addTrainer(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      disableClose: true,
      data: { role: 'trainer' } // Passing the role to the dialog box component
    });

    // Subscribe to the dialog's afterClosed() observable to get data when it's closed
    this.subscriptions.add(dialogRef.afterClosed().subscribe((result: any | undefined) => {
      if (result) {
        console.log("Result received:", result);

        const trainerToAdd: TechTrainerAdd = {
          techTrainerName: result.techTrainerName,
          techTrainerEmail: result.techTrainerEmail,
          techTrainerAssociateId: result.techTrainerAssociateId,
          description: result.description
        };

        console.log("NEW trainer to be added:", trainerToAdd);

        // Using your existing service method: addTechTrainer
        this.TechTrainerService.addTechTrainer("add", trainerToAdd).subscribe({
          next: (response: AddAssociateApiResponse) => {
            // Note: response.status = 200 should be response.status === 200 for comparison
            if (response.status === 200 || response.status === 201) { // Assuming 200 or 201 for success
              console.log("The technical trainer is added successfully");
              // IMPORTANT: Reload the data after a successful addition
              // This will update the table and all the counts dynamically.
              this.loadTechnicalTrainers();
            } else {
              console.error("Error adding the technical trainer details:", response.message);
              this.errorMessage = response.message || 'Failed to add technical trainer.';
              // TODO: Consider showing a user-friendly notification (e.g., MatSnackBar)
            }
          },
          error: (err: any) => {
            console.error('Error adding the technical trainer:', err);
            this.errorMessage = 'An error occurred while adding the trainer. Please try again.';
            // TODO: Consider showing a user-friendly notification
          }
        });
      } else {
        console.log('Dialog closed without adding a trainer.');
      }
    }));
  }
}
