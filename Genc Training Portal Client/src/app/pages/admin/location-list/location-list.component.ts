
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from 'src/app/services/location.service';
import { StorageService } from 'src/app/services/storage.service';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Removed this import

// Import your Location model and LocationApiResponse
import { Location, LocationApiResponse } from 'src/app/models/location.model';


// Import the dialog component for adding/editing locations
import { AddEditLocationDialogComponent } from './add-edit-location-dialog/add-edit-location-dialog.component';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    // MatProgressSpinnerModule // Removed this module from imports
  ]
})
export class LocationListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['sno', 'locationName', 'actions'];
  dataSource: MatTableDataSource<Location> = new MatTableDataSource<Location>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchQuery: string = '';
  isReadOnly = false;
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private locationService: LocationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isReadOnly = StorageService.isReadOnly();
    this.loadlocationDetails();

    this.dataSource.filterPredicate = (data: Location, filter: string) => {
      const textFilter = filter.toLowerCase();
      return data.locationId.toString().includes(textFilter) ||
             data.location.toLowerCase().includes(textFilter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters(): void {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Handles page change events from the MatPaginator.
   * @param event
   */
  onPageChange(event: any): void {
    console.log('Location table page changed:', event);
  }

  addLocation(): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot add location. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    const dialogRef = this.dialog.open(AddEditLocationDialogComponent, {
      width: '400px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newLocationName: string) => {
      if (newLocationName) {
        console.log('Dialog closed with new location name:', newLocationName);

        const locationToSend: Location = {
          locationId: 0,
          location: newLocationName
        };

        this.locationService.addNewLocation('add', locationToSend)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
          next: (response: LocationApiResponse) => {
            if (response.status === 201) {
              this.snackBar.open(response.message, 'Close', { duration: 3000 });
              console.log('Location added successfully to backend:', response.message);
              this.loadlocationDetails();
            } else {
              this.snackBar.open(response.message || 'Error adding location.', 'Close', { duration: 5000 });
              console.error('Backend returned an unexpected status after add:', response.status, response.message);
            }
          },
          error: (err: any) => {
            this.snackBar.open('Failed to add location. Please try again.', 'Close', { duration: 5000 });
            console.error('Error adding location to backend:', err);
          },
          complete: () => {
            console.log('Add location API call completed.');
          }
        });
      } else {
        console.log('Add location dialog closed without data (cancelled).');
      }
    });
  }

  onEditLocation(locationToEdit: Location): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot edit location. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    const dialogRef = this.dialog.open(AddEditLocationDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { ...locationToEdit }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedLocationFromDialog: Location) => {
      if (updatedLocationFromDialog) {
        console.log('Dialog closed with updated location data:', updatedLocationFromDialog);

        this.locationService.updateLocation(updatedLocationFromDialog.locationId, updatedLocationFromDialog)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
          next: (response: LocationApiResponse) => {
            if (response.status === 200) {
              this.snackBar.open(response.message, 'Close', { duration: 3000 });
              console.log('Location updated successfully on backend:', response.message);
              this.loadlocationDetails();
            } else {
              this.snackBar.open(response.message || 'Error updating location.', 'Close', { duration: 5000 });
              console.error('Backend returned an unexpected status during update:', response.status, response.message);
            }
          },
          error: (err: any) => {
            this.snackBar.open('Failed to update location. Please try again.', 'Close', { duration: 5000 });
            console.error('Error updating location on backend:', err);
          }
        });
      } else {
        console.log('Edit location dialog closed without data (cancelled or no changes).');
      }
    });
  }

  /**
   * Prompts the user for confirmation and deletes the selected location.
   * @param locationToDelete The Location object to be deleted.
   * On successful response, the entire list of locations is re-fetched.
   */
  onDeleteLocation(locationToDelete: Location): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot delete location. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    if (confirm(`Are you sure you want to delete location "${locationToDelete.location}" (ID: ${locationToDelete.locationId})?`)) {
      // Call backend service to delete the location
      this.locationService.deleteLocation(locationToDelete.locationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
        next: (response: LocationApiResponse) => {
          if (response.status === 200) { // Assuming 200 OK for successful delete
            this.snackBar.open(response.message, 'Close', { duration: 3000 });
            console.log(`Location "${locationToDelete.location}" deleted from backend. Response:`, response.message);
            this.loadlocationDetails();
          } else {
            this.snackBar.open(response.message || 'Error deleting location.', 'Close', { duration: 5000 });
            console.error('Backend returned an unexpected status during delete:', response.status, response.message);
          }
        },
        error: (err: any) => {
          this.snackBar.open('Failed to delete location. Please try again.', 'Close', { duration: 5000 });
          console.error('Error deleting location from backend:', err);
        }
      });
    }
  }

  /**
   * Fetches location details from the LocationService and populates the dataSource.
   */
  loadlocationDetails(): void {
    this.locationService.fetchLocations("all-locations")
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (locations: Location[]) => { // Service now maps to return Location[] directly
        this.dataSource.data = locations;
        console.log("Location details are fetched successfully ", this.dataSource.data);
      },
      error: (err: any) => {
        this.snackBar.open('Failed to load locations. Please try again later.', 'Close', { duration: 5000 });
        console.error('Location: Error fetching locations:', err);
      },
      complete: () => {
        console.log('LocationListComponent: Locations fetch completed.');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
