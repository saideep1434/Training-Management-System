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
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { Subscription } from 'rxjs'; // Import Subscription for cleanup

// Import the new dialog component
import { DialogComponent } from '../../components/add-trainer/add-trainer.component';
import { CoachService } from 'src/app/services/coach.service';
import { Coach, CoachAdd } from 'src/app/models/coach.model';
import { CommonCreateResponse } from 'src/app/models/ApiResponses.model';


// Define the interface for your Technical Trainer data structure
export interface MentorsData {
  id: number;
  associateId: number;
  uname: string; // Made non-optional as it's displayed as a main field
  domain: string; // Made non-optional
  email: string;
  cohorts: number;
}

// Sample data for the Technical Trainers table
// const TECHNICALTRAINER_DATA: MentorsData[] = [
//   {
//     id: 1,
//     associateId: 2398029,
//     uname: 'John Doe',
//     domain: 'SDET Trainer',
//     email: 'john.doe@example.com',
//     cohorts: 2,
//   },
//   {
//     id: 2,
//     associateId: 2398030,
//     uname: 'Jane Smith',
//     domain: 'Java Trainer',
//     email: 'jane.smith@example.com',
//     cohorts: 3,
//   },
//   {
//     id: 3,
//     associateId: 2398031,
//     uname: 'Alice Johnson',
//     domain: 'Python Trainer',
//     email: 'alice.j@example.com',
//     cohorts: 1,
//   },
//   {
//     id: 4,
//     associateId: 2398032,
//     uname: 'Bob Williams',
//     domain: '.NET Trainer',
//     email: 'bob.w@example.com',
//     cohorts: 4,
//   },
//   {
//     id: 5,
//     associateId: 2398033,
//     uname: 'Charlie Brown',
//     domain: 'Frontend Trainer',
//     email: 'charlie.b@example.com',
//     cohorts: 2,
//   },
//   {
//     id: 6,
//     associateId: 2398034,
//     uname: 'Diana Prince',
//     domain: 'QA Trainer',
//     email: 'diana.p@example.com',
//     cohorts: 5,
//   },
//   {
//     id: 7,
//     associateId: 2398035,
//     uname: 'Eve Adams',
//     domain: 'DevOps Trainer',
//     email: 'eve.a@example.com',
//     cohorts: 1,
//   },
//   {
//     id: 8,
//     associateId: 2398036,
//     uname: 'Frank White',
//     domain: 'Backend Trainer',
//     email: 'frank.w@example.com',
//     cohorts: 3,
//   },
//   {
//     id: 9,
//     associateId: 2398037,
//     uname: 'Grace Green',
//     domain: 'Cloud Trainer',
//     email: 'grace.g@example.com',
//     cohorts: 2,
//   },
//   {
//     id: 10,
//     associateId: 2398038,
//     uname: 'Henry Black',
//     domain: 'Mobile Trainer',
//     email: 'henry.b@example.com',
//     cohorts: 4,
//   },
//   {
//     id: 11,
//     associateId: 2398039,
//     uname: 'Ivy Blue',
//     domain: 'Data Science Trainer',
//     email: 'ivy.b@example.com',
//     cohorts: 1,
//   },
//   {
//     id: 12,
//     associateId: 2398040,
//     uname: 'Jack Yellow',
//     domain: 'AI/ML Trainer',
//     email: 'jack.y@example.com',
//     cohorts: 3,
//   },
// ];

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
    // Add MatDialogModule if not already included in MaterialModule
    // MatDialogModule // Uncomment if not in MaterialModule
  ],
  templateUrl: './coach.component.html',
})
export class AppCoachComponent implements OnInit, AfterViewInit, OnDestroy {
  // Define the columns that will be displayed in the Angular Material table
  displayedColumns1: string[] = [
    'serialNumber',
    'name',
    'associateId',
    'domain',
    'email',
    'cohorts',
    'actions'
  ];

  // Initialize MatTableDataSource with an array of MentorsData.
  dataSource1 = new MatTableDataSource<Coach>();

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

  // UX states
  isLoading: boolean = false;
  errorMessage: string = '';

  // Inject MatDialog service for opening dialogs
  constructor(private dialog: MatDialog, private coachService: CoachService) { }

  ngOnInit(): void {
    // Set the data for the MatTableDataSource.
    this.loadCoachDetails();

    // Calculate initial counts for the cards
    // this.updateTrainerCounts();


    // Define a custom filter predicate for the MatTableDataSource.
    // This allows you to specify how the filtering should be performed.
    this.dataSource1.filterPredicate = (data: Coach, filter: string) => {
      // You can expand this to search across multiple fields if needed
      return data.coachAssociateId.toString().toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit(): void {
    // Assign the MatPaginator instance to the dataSource's paginator property.
    this.dataSource1.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  /**
   * Updates the counts for total, assigned, and free trainers.
   * This should be called whenever `dataSource1.data` changes.
   */
  // updateTrainerCounts(): void {
  //   this.totalTrainers = this.dataSource1.data.length;
  //   this.assignedTrainers = this.dataSource1.data.filter(t => t.status === 'assigned').length;
  //   this.freeTrainers = this.dataSource1.data.filter(t => t.status === 'free').length;
  // }

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

  //lead the details of the coach
  loadCoachDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.coachService.fetchCoachDetails("all-coaches").subscribe({
      next: (CoachList: Coach[]) => {
        this.dataSource1 = new MatTableDataSource<Coach>(CoachList);
        if (this.paginator) {
          this.dataSource1.paginator = this.paginator;
        }
        // KPI counts
        this.totalTrainers = CoachList.length;
        const assignedCalculated = CoachList.filter((c: any) => (c?.status === 'assigned') || ((c?.cohorts ?? 0) > 0)).length;
        this.assignedTrainers = assignedCalculated;
        this.freeTrainers = Math.max(this.totalTrainers - assignedCalculated, 0);
        this.isLoading = false;
        console.log("Coach details fetched successfully.", { total: this.totalTrainers, assigned: this.assignedTrainers, free: this.freeTrainers });
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load coaches. Please try again.';
        console.error('CoachComponent: Error fetching Coach details:', err);
      },
      complete: () => {
        // no-op
      }
    });
  }

  /**
   * Opens the AddTrainerDialogComponent to add a new trainer.
   */
  addCoach(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px', // Set desired width for the dialog
      disableClose: true,// Prevent closing by clicking outside or pressing ESC
      data: { role: 'coach' } 
    });

    // Subscribe to the dialog's afterClosed() observable to get data when it's closed
    this.subscriptions.add(dialogRef.afterClosed().subscribe((result: any | undefined) => {
      if (result) {
        // Generate a new ID (simple increment for demo, use a more robust method for real apps)
        // const newId = this.dataSource1.data.length > 0 ? Math.max(...this.dataSource1.data.map(t => t.id)) + 1 : 1;
        // const coachToAdd: Coach = { ...newCoach};
        console.log("data recieved from the dialog" , result);

        const coachToAdd: CoachAdd = {
          coachAssociateId: result.coachAssociateId, // Convert to number if needed
          coachName: result.coachName,
          coachEmail: result.coachEmail
          // Add other properties if they exist for CoachAdd based on your `inputElements` for 'coach'
      };

      console.log("coach object created:" , coachToAdd);

      this.coachService.addNewCoach("add", coachToAdd).subscribe({
        next: (response: CommonCreateResponse) => {
          if(response.status == 201){
            console.log("Coach details added successfully", response.message);
          }
          else{
            console.error("Errorrrrrr", response.message);
          }
        }
      })

        // Add the new trainer to the data source
        // const currentData = this.dataSource1.data;
        // this.dataSource1.data = [...currentData, coachToAdd];

        // Update the counts for the cards
        // this.updateTrainerCounts();

        // Optional: Reset paginator to first page to show the new item
        if (this.dataSource1.paginator) {
          this.dataSource1.paginator.lastPage(); // Go to last page to see new entry
        }
        console.log('New Coach Added:', coachToAdd);
      } else {
        console.log('Dialog closed without adding a Coach.');
      }
    }));
  }
}
