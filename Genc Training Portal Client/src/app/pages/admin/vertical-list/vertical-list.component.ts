
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBarModule

// Import your Vertical model and VerticalService
import { vertical } from 'src/app/models/vertical.model'; // Make sure this path is correct
//import { VerticalService } from 'src/app/services/vertical.service'; // Import VerticalService
import { VerticalService } from 'src/app/services/verticals.service';
import { StorageService } from 'src/app/services/storage.service';
// Import the dialog component for adding/editing verticals
import { AddEditVerticalDialogComponent } from './add-edit-vertical-dialog/add-edit-vertical-dialog.component';

@Component({
  selector: 'app-vertical-list',
  templateUrl: './vertical-list.component.html',
  styleUrls: ['./vertical-list.component.scss'],
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
    MatSnackBarModule, // Add MatSnackBarModule to imports
  ]
})
export class VerticalListComponent implements OnInit, AfterViewInit, OnDestroy {
  // Columns now include 'domainName' to match your backend model
  displayedColumns: string[] = ['sno', 'verticalName', 'domainName', 'actions'];
  dataSource: MatTableDataSource<vertical> = new MatTableDataSource<vertical>(); // Initialize here

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchQuery: string = '';
  isReadOnly = false;
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private verticalService: VerticalService, // Inject VerticalService
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isReadOnly = StorageService.isReadOnly();
    // Load data from the backend when the component initializes
    this.loadVerticalDetails();

    this.dataSource.filterPredicate = (data: vertical, filter: string) => {
      const textFilter = filter.toLowerCase();
      // Filter by verticalName, domainName, or verticalId (assuming backend ID can be searched as string)
      return data.verticalName.toLowerCase().includes(textFilter) ||
             data.domainName.toLowerCase().includes(textFilter) ||
             data.verticalId.toLowerCase().includes(textFilter); // Use verticalId from model for search
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Applies the current search query as a filter to the data source.
   * Resets the paginator to the first page if a filter is applied.
   */
  applyFilters(): void {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Handles page change events from the MatPaginator.
   * @param event The page event object.
   */
  onPageChange(event: any): void {
    console.log('Vertical table page changed:', event);
  }

  /**
   * Opens the AddEditVerticalDialogComponent to add a new vertical.
   * If new data is returned, it's sent to the backend via VerticalService.
   */
  addVertical(): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot add vertical. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    const dialogRef = this.dialog.open(AddEditVerticalDialogComponent, {
      width: '400px',
      disableClose: true,
      data: null // No initial data for adding a new vertical
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newVerticalData: vertical) => {
        if (newVerticalData) {
          console.log('Dialog closed with new vertical data:', newVerticalData);

          // Call the service to add the vertical to the backend
          this.verticalService.addVertical(newVerticalData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                // Check status from the backend response
                if (response.status === 201) { // Assuming 201 Created for successful addition
                  this.snackBar.open(response.message, 'Close', { duration: 3000 });
                  this.loadVerticalDetails(); // Re-fetch all verticals to update the table
                } else {
                  // Handle other status codes returned by backend indicating an issue
                  this.snackBar.open(response.message || 'Error adding vertical.', 'Close', { duration: 5000 });
                }
              },
              error: (err) => {
                // Handle HTTP errors (e.g., network issues, 500 server error)
                this.snackBar.open('Failed to add vertical. Please try again.', 'Close', { duration: 5000 });
                console.error('Error adding vertical to backend:', err);
              }
            });
        } else {
          console.log('Add vertical dialog closed without data (cancelled).');
        }
      });
  }

  /**
   * Opens the AddEditVerticalDialogComponent to edit an existing vertical.
   * If updated data is returned, it's sent to the backend via VerticalService.
   * @param verticalToEdit The Vertical object to be edited.
   */
  onEditVertical(verticalToEdit: vertical): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot edit vertical. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    const dialogRef = this.dialog.open(AddEditVerticalDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { ...verticalToEdit } // Pass a copy of the data
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedVerticalFromDialog: vertical) => {
        // Ensure verticalId exists for update
        if (updatedVerticalFromDialog && updatedVerticalFromDialog.verticalId) {
          console.log('Dialog closed with updated vertical data:', updatedVerticalFromDialog);

          // Call the service to update the vertical on the backend
          this.verticalService.updateVertical(updatedVerticalFromDialog.verticalId, updatedVerticalFromDialog)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.status === 200) { // Assuming 200 OK for successful update
                  this.snackBar.open(response.message, 'Close', { duration: 3000 });
                  this.loadVerticalDetails(); // Re-fetch the entire list
                } else {
                  this.snackBar.open(response.message || 'Error updating vertical.', 'Close', { duration: 5000 });
                }
              },
              error: (err) => {
                this.snackBar.open('Failed to update vertical. Please try again.', 'Close', { duration: 5000 });
                console.error('Error updating vertical on backend:', err);
              }
            });
        } else {
          console.log('Edit vertical dialog closed without data (cancelled or no changes, or no ID for update).');
        }
      });
  }

  /**
   * Prompts the user for confirmation and deletes the selected vertical from the backend.
   * @param verticalToDelete The Vertical object to be deleted.
   */
  onDeleteVertical(verticalToDelete: vertical): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot delete vertical. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    if (confirm(`Are you sure you want to delete vertical "${verticalToDelete.verticalName}" (ID: ${verticalToDelete.verticalId})?`)) {
      // Call the service to delete the vertical from the backend
      this.verticalService.deleteVertical(verticalToDelete.verticalId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status === 200) { // Assuming 200 OK for successful delete
              this.snackBar.open(response.message, 'Close', { duration: 3000 });
              this.loadVerticalDetails(); // Re-fetch the entire list
            } else {
              this.snackBar.open(response.message || 'Error deleting vertical.', 'Close', { duration: 5000 });
            }
          },
          error: (err) => {
            this.snackBar.open('Failed to delete vertical. Please try again.', 'Close', { duration: 5000 });
            console.error('Error deleting vertical from backend:', err);
          }
        });
    }
  }

  /**
   * Fetches vertical details from the VerticalService and populates the dataSource.
   */
  loadVerticalDetails(): void {
    // Call the service to fetch all verticals from the backend
    this.verticalService.fetchVerticals("all-verticals")
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (verticals: vertical[]) => { // The service's map operator already returns Vertical[]
          this.dataSource.data = verticals;
          console.log("Vertical details fetched successfully:", this.dataSource.data);
        },
        error: (err: any) => {
          this.snackBar.open('Failed to load verticals. Please try again later.', 'Close', { duration: 5000 });
          console.error('VerticalListComponent: Error fetching verticals:', err);
        },
        complete: () => {
          console.log('VerticalListComponent: Verticals fetch completed.');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
