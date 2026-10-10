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
import { BHTrainerService } from 'src/app/services/bhtrainer.service';
// Ensure these imports are correct based on your file structure
import { BhTrainer, BhtrainerAdd } from 'src/app/models/BhTrainer.model';
import { AddAssociateApiResponse, CommonCreateResponse } from 'src/app/models/ApiResponses.model'; // Assuming CommonCreateResponse is for addNewBhTrainer


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
  templateUrl: './bh-trainer.component.html', // Make sure this path is correct
})
export class AppBhTrainerComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns1: string[] = [
    'serialNumber',
    'name',
    'associateId',
    'domain',
    'email',
    'cohorts',
    'actions'
  ];

  dataSource1 = new MatTableDataSource<BhTrainer>();
  trainerSearchTerm: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private subscriptions = new Subscription();

  // Properties to display in the app-card components - these will be dynamically set
  totalTrainers: number = 0;
  assignedTrainers: number = 0;
  freeTrainers: number = 0;

  // Added for better UX (optional, but good practice)
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private dialog: MatDialog, private bhTrainerService: BHTrainerService) { }

  ngOnInit(): void {
    this.loadBhTrainersDetails(); // Call the method to fetch data and set counts

    this.dataSource1.filterPredicate = (data: BhTrainer, filter: string) => {
      // Ensure data.bhTrainerAssociateId is handled as string for filtering
      // Adding a null check for safety (e.g., if data or bhTrainerAssociateId could be undefined)
      return data.bhTrainerAssociateId?.toString().toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit(): void {
    // Assign the MatPaginator instance to the dataSource's paginator property.
    // Ensure paginator is available before assigning.
    if (this.paginator) {
      this.dataSource1.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  /**
   * Method to extract the Bh trainers details from the service
   * and dynamically calculate total, assigned, and free trainers.
   */
  loadBhTrainersDetails(): void {
    this.isLoading = true; // Set loading state
    this.errorMessage = ''; // Clear any previous error messages

    // Using your existing method name: fetchBhTrainersDetails
    this.bhTrainerService.fetchBhTrainersDetails("all-bh-trainers").subscribe({
      next: (bhtrainers: BhTrainer[]) => { // Assuming this directly returns an array of BhTrainer
        this.dataSource1 = new MatTableDataSource<BhTrainer>(bhtrainers);
        // Re-assign paginator if a new MatTableDataSource instance is created
        if (this.paginator) {
          this.dataSource1.paginator = this.paginator;
        }
        this.totalTrainers = bhtrainers.length;

        // IMPORTANT: These calculations for assigned and free trainers
        // depend on your 'BhTrainer' model having a 'status' field (or similar).
        // If your BhTrainer model does NOT have a 'status' field that indicates
        // 'assigned' or 'free' (e.g., 'status?: 'assigned' | 'free';'),
        // then these lines will not work as intended, and you'll need to define
        // how "assigned" vs. "free" is determined from your data.
        this.assignedTrainers = bhtrainers.filter(trainer => trainer.status === 'assigned').length;
        this.freeTrainers = bhtrainers.filter(trainer => trainer.status === 'free').length;

        this.isLoading = false; // Turn off loading state
        console.log("Bhtrainers details are fetched successfully. Total:", this.totalTrainers,
          "Assigned:", this.assignedTrainers, "Free:", this.freeTrainers);
      },
      error: (err: any) => {
        this.isLoading = false; // Turn off loading state even on error
        this.errorMessage = 'Failed to load B&H trainers. Please check the console for details.';
        console.error('BHTrainerListComponent: Error fetching BH trainers:', err);
      },
      complete: () => {
        console.log('BHTrainerListComponent: BH trainers fetch completed.');
      }
    });
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
      data: { role: 'bh-trainer' }
    });

    // Subscribe to the dialog's afterClosed() observable to get data when it's closed
    this.subscriptions.add(dialogRef.afterClosed().subscribe((result: BhtrainerAdd | undefined) => {
      if (result) {
        const bhTrainerToAdd: BhtrainerAdd = {
          bhTrainerAssociateId: result.bhTrainerAssociateId,
          bhTrainerName: result.bhTrainerName,
          bhTrainerEmail: result.bhTrainerEmail
        };

        // Using your existing method name: addNewBhTrainer
        this.bhTrainerService.addNewBhTrainer("add", bhTrainerToAdd).subscribe({
          next: (response: AddAssociateApiResponse) => {
            if (response.status === 201) {
              console.log("Bh Trainer is added successfully");
              // IMPORTANT: Reload the data after a successful addition
              // This will update the table and all the counts dynamically.
              this.loadBhTrainersDetails();
            } else {
              console.error("Error adding the BH Trainer ", response.message);
              // TODO: Display an error message to the user (e.g., using MatSnackBar)
            }


          },
          error: (err: any) => {
            console.error('Error adding BH trainer:', err);
            // TODO: Display an error message to the user
          }
        });
      } else {
        console.log('Dialog closed without adding a BH trainer.');
      }
    }));
  }
}