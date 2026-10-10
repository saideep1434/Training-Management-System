

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
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

// --- CRITICAL FIX: Correct import path and capitalized interface name ---
import { ServiceLine } from 'src/app/models/serviceLine.model';
import { serviceLineApiResponse } from 'src/app/models/ApiResponses.model';
// --- CRITICAL FIX: Correct ServiceLineService import path and casing ---
//import { ServiceLineService } from 'src/app/services/serviceline.service'; // Corrected path and casing
import { ServiceLineService } from 'src/app/services/serviceLine.service';
import { StorageService } from 'src/app/services/storage.service';
// Import the dialog component
import { AddEditServiceLineDialogComponent } from './add-edit-service-line-dialog/add-edit-service-line-dialog.component';

@Component({
  selector: 'app-service-line-list',
  templateUrl: './service-line-list.component.html',
  styleUrls: ['./service-line-list.component.scss'],
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
  ]
})
export class ServiceLineListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['sno', 'trackName', 'domainName', 'actions'];
  dataSource: MatTableDataSource<ServiceLine>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchQuery: string = '';
  isLoadingResults = true;
  isReadOnly = false;
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private serviceLineService: ServiceLineService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<ServiceLine>([]);
  }

  ngOnInit(): void {
    this.isReadOnly = StorageService.isReadOnly();
    this.loadServiceLines();

    this.dataSource.filterPredicate = (data: ServiceLine, filter: string) => {
      const textFilter = filter.toLowerCase();
      return data.trackName.toLowerCase().includes(textFilter) ||
             data.domainName.toLowerCase().includes(textFilter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.sort) {
        this.dataSource.sort = this.sort;
    }
  }

  /**
   * Loads all service lines from the backend using the ServiceLineService.
   */
  loadServiceLines(): void {
    this.isLoadingResults = true;
    // --- CRITICAL FIX: Use ServiceLineApiResponse here (capitalized) ---
    this.serviceLineService.fetchAllServiceLines("all")
      .pipe(
        finalize(() => this.isLoadingResults = false),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (serviceLines: ServiceLine[]) => {
          // The error was happening because if serviceLineId was string in model,
          // but you were converting to number here OR the backend sent number
          // and the model expected string. Ensure model is 'number'.
          this.dataSource.data = serviceLines.map((sl, index) => ({
            ...sl,
            // This conversion is only truly needed if your backend occasionally sends it as string,
            // but if your model is 'number', TypeScript will enforce it and backend should return number.
            serviceLineId: typeof sl.serviceLineId === 'string' ? parseInt(sl.serviceLineId, 10) : sl.serviceLineId,
            serialNo: index + 1
          }));
          this.applyFilters();
          console.log('Service Lines loaded:', this.dataSource.data);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading service lines:', error);
          const errorMessage = error.error?.message || 'Failed to load service lines.';
          this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          this.dataSource.data = [];
        }
      });
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
    console.log('Service Line table page changed:', event);
  }

  /**
   * Opens the AddEditServiceLineDialogComponent to add a new service line.
   * After the dialog closes, if new data is returned, it's added via the service.
   */
  addServiceLine(): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot add service line. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    const dialogRef = this.dialog.open(AddEditServiceLineDialogComponent, {
      width: '450px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newServiceLine: ServiceLine) => {
      if (newServiceLine) {
        console.log('Dialog closed with new service line data:', newServiceLine);
        this.serviceLineService.addServiceLine(newServiceLine)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response: serviceLineApiResponse) => { // Explicitly type response
              if (response.status === 201) {
                this.snackBar.open(response.message, 'Success', { duration: 3000, panelClass: ['success-snackbar'] });
                this.loadServiceLines();
              } else {
                this.snackBar.open(response.message || 'Failed to add service line.', 'Error', { duration: 3000, panelClass: ['error-snackbar'] });
              }
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error adding service line:', error);
              const errorMessage = error.error?.message || 'An unexpected error occurred during add.';
              this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
            }
          });
      } else {
        console.log('Add service line dialog closed without data (cancelled).');
      }
    });
  }

  /**
   * Opens the AddEditServiceLineDialogComponent to edit an existing service line.
   * After the dialog closes, if updated data is returned, the corresponding service line is updated via the service.
   * @param serviceLineToEdit The ServiceLine object to be edited.
   */
  onEditServiceLine(serviceLineToEdit: ServiceLine): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot edit service line. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    const dialogRef = this.dialog.open(AddEditServiceLineDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { ...serviceLineToEdit }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedServiceLine: ServiceLine) => {
      // --- CRITICAL CHANGE: Check for trackName for update ---
      if (updatedServiceLine && updatedServiceLine.trackName) {
        console.log('Dialog closed with updated service line data:', updatedServiceLine);
        // --- CRITICAL CHANGE: Pass original trackName and updated ServiceLine object ---
        this.serviceLineService.updateServiceLine(serviceLineToEdit.trackName, updatedServiceLine)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response: serviceLineApiResponse) => { // Explicitly type response
              if (response.status === 200) {
                this.snackBar.open(response.message, 'Success', { duration: 3000, panelClass: ['success-snackbar'] });
                this.loadServiceLines();
              } else {
                this.snackBar.open(response.message || 'Failed to update service line.', 'Error', { duration: 3000, panelClass: ['error-snackbar'] });
              }
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error updating service line:', error);
              const errorMessage = error.error?.message || 'An unexpected error occurred during update.';
              this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
            }
          });
      } else {
        console.log('Edit service line dialog closed without data or invalid data (cancelled or no trackName for update).');
      }
    });
  }

  /**
   * Prompts the user for confirmation and deletes the selected service line via the service.
   * @param serviceLineToDelete The ServiceLine object to be deleted.
   */
  onDeleteServiceLine(serviceLineToDelete: ServiceLine): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot delete service line. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    // --- CRITICAL CHANGE: Check for trackName for delete ---
    if (!serviceLineToDelete.trackName) {
      this.snackBar.open('Cannot delete: Service Line Track Name is missing.', 'Error', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }

    if (confirm(`Are you sure you want to delete service line "${serviceLineToDelete.trackName}"?`)) {
      // --- CRITICAL CHANGE: Pass trackName for delete ---
      this.serviceLineService.deleteServiceLine(serviceLineToDelete.trackName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: serviceLineApiResponse) => { // Explicitly type response
            if (response.status === 200) {
              this.snackBar.open(response.message, 'Success', { duration: 3000, panelClass: ['success-snackbar'] });
              this.loadServiceLines();
            } else {
              this.snackBar.open(response.message || 'Failed to delete service line.', 'Error', { duration: 3000, panelClass: ['error-snackbar'] });
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error deleting service line:', error);
            const errorMessage = error.error?.message || 'An unexpected error occurred during delete.';
            this.snackBar.open(errorMessage, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
