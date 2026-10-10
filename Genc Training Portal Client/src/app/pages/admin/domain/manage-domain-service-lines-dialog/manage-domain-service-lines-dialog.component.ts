


import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog'; // Added MatDialog
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// Models
import { Domain } from 'src/app/models/class/domain.model';
import { ServiceLine } from 'src/app/models/class/serviceline.model';

// Dialog for adding/editing a single service line (reusing the one from service-line-list)
//import { AddEditServiceLineDialogComponent } from 'src/app/service-line-list/add-edit-service-line-dialog/add-edit-service-line-dialog.component';
import { AddEditServiceLineDialogComponent } from '../../service-line-list/add-edit-service-line-dialog/add-edit-service-line-dialog.component';
@Component({
  selector: 'app-manage-domain-service-lines-dialog',
  templateUrl: './manage-domain-service-lines-dialog.component.html',
  styleUrls: ['./manage-domain-service-lines-dialog.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ]
})
export class ManageDomainServiceLinesDialogComponent implements OnInit, AfterViewInit {
  // The domain object whose service lines are being managed
  domain: Domain;

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource: MatTableDataSource<ServiceLine>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchQuery: string = '';

  constructor(
    public dialogRef: MatDialogRef<ManageDomainServiceLinesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { domain: Domain },
    private dialog: MatDialog // Injected MatDialog service
  ) {
    // Initialize the domain from the injected data
    this.domain = { ...data.domain }; // Create a copy to avoid direct mutation of the original object
    this.dataSource = new MatTableDataSource(this.domain.serviceLines);
  }

  ngOnInit(): void {
    // Set up the filter predicate for service lines
    this.dataSource.filterPredicate = (data: ServiceLine, filter: string) => {
      const textFilter = filter.toLowerCase();
      return data.id.toLowerCase().includes(textFilter) ||
        data.name.toLowerCase().includes(textFilter) ||
        (data.description?.toLowerCase().includes(textFilter) || false);
    };
    this.applyFilters();
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

  onPageChange(event: any): void {
    console.log('Service Line table page changed:', event);
  }

  addServiceLine(): void {
    // Use the injected 'dialog' service directly
    const dialogRef = this.dialog.open(AddEditServiceLineDialogComponent, {
      width: '400px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe((newServiceLine: ServiceLine) => {
      if (newServiceLine) {
        // Check for duplicate ID before adding
        if (this.domain.serviceLines.some(sl => sl.id === newServiceLine.id)) {
          console.warn(`Service Line with ID "${newServiceLine.id}" already exists in this domain.`);
          // Optionally, show a user-friendly error message (e.g., MatSnackBar)
          return;
        }
        this.domain.serviceLines.push(newServiceLine);
        this.updateDataSource();
        this.dataSource.paginator?.lastPage();
      }
    });
  }

  onEditServiceLine(serviceLineToEdit: ServiceLine): void {
    // Use the injected 'dialog' service directly
    const dialogRef = this.dialog.open(AddEditServiceLineDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { ...serviceLineToEdit }
    });

    dialogRef.afterClosed().subscribe((updatedServiceLine: ServiceLine) => {
      if (updatedServiceLine) {
        const index = this.domain.serviceLines.findIndex(sl => sl.id === updatedServiceLine.id);
        if (index !== -1) {
          this.domain.serviceLines[index] = updatedServiceLine;
          this.updateDataSource();
        }
      }
    });
  }

  onDeleteServiceLine(serviceLineToDelete: ServiceLine): void {
    if (window.confirm(`Are you sure you want to delete service line "${serviceLineToDelete.name}" (ID: ${serviceLineToDelete.id}) from "${this.domain.domainName}"?`)) {
      this.domain.serviceLines = this.domain.serviceLines.filter(sl => sl.id !== serviceLineToDelete.id);
      this.updateDataSource();
      console.log(`Service line "${serviceLineToDelete.name}" deleted from domain "${this.domain.domainName}".`);
    }
  }

  private updateDataSource(): void {
    this.dataSource.data = [...this.domain.serviceLines];
    this.applyFilters();
  }

  onClose(): void {
    // When closing, return the potentially modified domain object
    this.dialogRef.close(this.domain);
  }
}

