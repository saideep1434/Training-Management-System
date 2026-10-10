// // src/app/pages/admin/add-people/add-people.component.ts

// import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';

// import { FormsModule } from '@angular/forms';

// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { AddPersonDetailsDialogComponent } from './add-person-details-dialog/add-person-details-dialog.component';
// import { ROLES, RoleValue } from 'src/app/shared/constants/roles';
// import { Associate, Person } from 'src/app/models/Person.model';
// // Material UI Modules
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
// import { CommonModule } from '@angular/common';
// import { MatSelectModule } from '@angular/material/select';
// import { AdminService } from 'src/app/services/admin.service';
// import { Observable } from 'rxjs';


// @Component({
//   selector: 'app-add-people',
//   templateUrl: './add-people.component.html',
//   styleUrls: ['./add-people.component.scss'],
//   standalone: true,
//   imports: [
//     FormsModule,
//     MatSidenavModule,
//     MatIconModule,
//     MatButtonModule,
//     MatInputModule,
//     MatFormFieldModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatSortModule,
//     MatDialogModule,
//     CommonModule,
//     MatSelectModule
//   ]
// })
// export class AddPeopleComponent implements OnInit, AfterViewInit {
//   // Add 'actions' to the displayedColumns array
//   displayedColumns: string[] = ['id', 'fullName', 'emailId', 'role', 'actions'];
//   dataSource: MatTableDataSource<Associate>;

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   searchQuery: string = '';
//   selectedRoleFilter: string = '';

//   rolesList = Object.values(ROLES);

//   private generateEmail(fullName: string): string {
//     return `${fullName.toLowerCase().replace(/\s/g, '.')}.@example.com`;
//   }

//   currentPeople: Associate[] = [];

//   // currentPeopleData: Associate[] = [
//   //   // { fullName: 'Konstantin Konstantinopoleos', id: '14321', emailId: 'konstantin.konstantinopoleos.@example.com', role: ROLES.SKILLING_LEAD },
//   //   // { fullName: 'Andrew Salgado', id: '21845', emailId: 'andrew.salgado.@example.com', role: ROLES.ACADEMIC_COORDINATOR },
//   //   // { fullName: 'Magdalena Edinburgh', id: '1894', emailId: 'magdalena.edinburgh.@example.com', role: ROLES.TECH_TRAINER },
//   //   // { fullName: 'Matt Travis', id: '135567', emailId: 'matt.travis.@example.com', role: ROLES.COACH },
//   //   // { fullName: 'Daniel Wellington', id: '10973', emailId: 'daniel.wellington.@example.com', role: ROLES.BH_TRAINER },
//   //   // { fullName: 'Lucia Minoconi', id: '6324', emailId: 'lucia.minoconi.@example.com', role: ROLES.MENTOR },
//   //   // { fullName: 'Anette Brown', id: '4322', emailId: 'anette.brown.@example.com', role: ROLES.CR },
//   //   // { fullName: 'Christian Lambrou', id: '4521', emailId: 'christian.lambrou.@example.com', role: ROLES.ADMIN },
//   //   // { fullName: 'Phil Collins', id: '1472', emailId: 'phil.collins.@example.com', role: ROLES.TECH_TRAINER },
//   //   // { fullName: 'Winston Holliday', id: '45667', emailId: 'winston.holliday.@example.com', role: ROLES.SKILLING_LEAD },
//   //   // { fullName: 'Carla Andrade', id: '98871', emailId: 'carla.andrade.@example.com', role: ROLES.COACH },
//   //   // { fullName: 'Emily Davis', id: '11223', emailId: 'emily.davis.@example.com', role: ROLES.MENTOR },
//   //   // { fullName: 'Michael Smith', id: '22334', emailId: 'michael.smith.@example.com', role: ROLES.ADMIN },
//   //   // { fullName: 'Jessica Brown', id: '33445', emailId: 'jessica.brown.@example.com', role: ROLES.BH_TRAINER },
//   //   // { fullName: 'David Wilson', id: '44556', emailId: 'david.wilson.@example.com', role: ROLES.TECH_TRAINER },
//   //   // { fullName: 'Sarah Taylor', id: '55667', emailId: 'sarah.taylor.@example.com', role: ROLES.CR },
//   //   // { fullName: 'Chris Green', id: '66778', emailId: 'chris.green.@example.com', role: ROLES.SKILLING_LEAD },
//   //   // { fullName: 'Olivia White', id: '77889', emailId: 'olivia.white.@example.com', role: ROLES.ACADEMIC_COORDINATOR },
//   //   // { fullName: 'James Black', id: '88990', emailId: 'james.black.@example.com', role: ROLES.MENTOR },
//   //   // { fullName: 'Sophie King', id: '99001', emailId: 'sophie.king.@example.com', role: ROLES.ADMIN },
//   // ];

//   private users : Associate[];

//   constructor(private dialog: MatDialog, private adminService: AdminService) {
//     this.dataSource = new MatTableDataSource(this.currentPeople);
//   }


//   ngOnInit() {

//     this.fetchPeople();

//     this.applyFilters();
//     console.log(this.dataSource);

//   }

//   fetchPeople() {
//     this.adminService.fetchAllUsers("all").subscribe({
//       next: (associates : Associate[]) => {
//         this.currentPeople = associates;
//         this.updateDataSource();
//         console.log(this.currentPeople);

//       }
//     })
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

//   applyFilters() {
//     this.dataSource.filterPredicate = (data: Associate, filter: string) => {
//       const textFilter = this.searchQuery.trim().toLowerCase();
//       const textMatch = data.associateName.toLowerCase().includes(textFilter) ||
//         data.associateEmail.toLowerCase().includes(textFilter) ||
//         data.role.toLowerCase().includes(textFilter) ||
//         data.associateId.toLowerCase().includes(textFilter);

//       const roleMatch = this.selectedRoleFilter === '' || data.role === this.selectedRoleFilter;

//       return textMatch && roleMatch;
//     };

//     this.dataSource.filter = 'triggered';

//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }

//   onPageChange(event: any) {
//     console.log('Page changed:', event);
//   }



//   addPeople() {
//     const dialogRef = this.dialog.open(AddPersonDetailsDialogComponent, {
//       width: '500px',
//       disableClose: true,
//       data: null // No initial data for adding
//     });

//     dialogRef.afterClosed().subscribe((newPerson: Associate) => {
//       if (newPerson) {
//         console.log('Dialog closed with new person data:', newPerson);
//         this.users.push(newPerson);
//         this.updateDataSource(); // Call a helper to update and filter
//         this.dataSource.paginator?.lastPage();
//       } else {
//         console.log('Dialog closed without data (cancelled).');
//       }
//     });
//   }

//   onEdit(personToEdit: Person): void {
//     const dialogRef = this.dialog.open(AddPersonDetailsDialogComponent, {
//       width: '500px',
//       disableClose: true,
//       data: { ...personToEdit } // Pass a copy of the person data to the dialog
//     });

//     dialogRef.afterClosed().subscribe((updatedPerson: Associate) => {
//       if (updatedPerson) {
//         console.log('Dialog closed with updated person data:', updatedPerson);
//         // Find the index of the person in the array and replace it
//         const index = this.currentPeople.findIndex(p => p.associateId === updatedPerson.associateId);
//         if (index !== -1) {
//           this.currentPeople[index] = updatedPerson;
//           this.updateDataSource(); // Call a helper to update and filter
//         }
//       } else {
//         console.log('Edit dialog closed without data (cancelled or no changes).');
//       }
//     });
//   }

//   onDelete(personToDelete: Associate): void {
//     if (confirm(`Are you sure you want to delete ${personToDelete.associateName}?`)) {
//       this.currentPeople= this.currentPeople.filter(p => p.associateId !== personToDelete.associateId);
//       this.updateDataSource(); // Call a helper to update and filter
//       console.log(`${personToDelete.associateName} deleted.`);
//     }
//   }

//   private updateDataSource(): void {
//     this.dataSource.data = [...this.currentPeople]; // Create a new array reference for change detection
//     this.applyFilters();
//   }
// }

// src/app/pages/admin/add-people/add-people.component.ts


// src/app/pages/admin/add-people/add-people.component.ts

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPersonDetailsDialogComponent } from './add-person-details-dialog/add-person-details-dialog.component';
import { ROLES, RoleValue } from 'src/app/shared/constants/roles';
import { Associate, Person } from 'src/app/models/Person.model';
// Material UI Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from 'src/app/services/admin.service'; // Ensure AdminService is imported
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    CommonModule,
    MatSelectModule,
    MatSnackBarModule
  ]
})
export class AddPeopleComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  displayedColumns: string[] = ['sno','id', 'associateId', 'associateName', 'associateEmail', 'role', 'actions'];
  dataSource: MatTableDataSource<Associate>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchQuery: string = '';
  selectedRoleFilter: string = '';
  isReadOnly = false;

  rolesList = Object.values(ROLES);

  private generateEmail(fullName: string): string {
    return `${fullName.toLowerCase().replace(/\s/g, '.')}.@example.com`;
  }

  currentPeople: Associate[] = [];

  constructor(private dialog: MatDialog, private adminService: AdminService, private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource(this.currentPeople);
  }

  ngOnInit() {
    this.isReadOnly = StorageService.isReadOnly();
    this.fetchPeople();
    // applyFilters will be called in updateDataSource after fetchPeople
  }

  fetchPeople() {
    this.adminService.fetchAllUsers("all")
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (associates: Associate[]) => {
          this.currentPeople = associates;
          console.log("Fetched associates:", this.currentPeople);
          this.updateDataSource();
        },
        error: (err: HttpErrorResponse) => {
          console.error("Error fetching associates:", err);
          this.snackBar.open('Failed to load users. Please try again.', 'Close', { duration: 4000 });
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    this.dataSource.filterPredicate = (data: Associate, filter: string) => {
      const textFilter = this.searchQuery.trim().toLowerCase();
      const textMatch = data.associateName.toLowerCase().includes(textFilter) ||
        data.associateEmail.toLowerCase().includes(textFilter) ||
        data.role.toLowerCase().includes(textFilter) ||
        data.associateId.toLowerCase().includes(textFilter);

      const roleMatch = this.selectedRoleFilter === '' || data.role === this.selectedRoleFilter;

      return textMatch && roleMatch;
    };

    this.dataSource.filter = 'triggered';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: any) {
    console.log('Page changed:', event);
  }

  addPeople() {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot add user. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    const dialogRef = this.dialog.open(AddPersonDetailsDialogComponent, {
      width: '500px',
      disableClose: true,
      data: null // No initial data for adding
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newPerson: Associate) => {
        if (newPerson) {
          console.log('Attempting to add new person to backend:', newPerson);
          this.adminService.addUser('add', newPerson)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (addedAssociate: Associate) => {
                console.log('User successfully added to backend:', addedAssociate);
                this.currentPeople.push(addedAssociate);
                this.updateDataSource();
                this.dataSource.paginator?.lastPage();
                this.snackBar.open('User added successfully!', 'Close', { duration: 3000 });
              },
              error: (error: any) => {
                console.error('Error adding user to backend:', error);
                this.snackBar.open('Failed to add user. Please try again.', 'Close', { duration: 4000 });
              }
            });
        } else {
          console.log('Add dialog closed without data (cancelled).');
        }
      });
  }

  onEdit(personToEdit: Associate): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot edit user. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    const dialogRef = this.dialog.open(AddPersonDetailsDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { ...personToEdit } // Pass a copy of the person data to the dialog
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedPerson: Associate) => {
        if (updatedPerson) {
          console.log('Dialog closed with updated person data:', updatedPerson);

          // Make sure associateId is accessible for the API call.
          // If it was disabled in the dialog, `updatedPerson.associateId` will still hold its original value,
          // which is what we want for the PUT request URL.
          const associateIdToUpdate = updatedPerson.id;

          console.log('Attempting to update user on backend:', associateIdToUpdate, updatedPerson);
          this.adminService.updateUser("update", associateIdToUpdate, updatedPerson)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (returnedUpdatedAssociate: Associate) => {
                console.log('User successfully updated on backend:', returnedUpdatedAssociate);
                // Find the index of the person in the local array and replace it with the data returned by the backend
                const index = this.currentPeople.findIndex(p => p.associateId === returnedUpdatedAssociate.associateId);
                if (index !== -1) {
                  this.currentPeople[index] = returnedUpdatedAssociate; // Update local data with backend's response
                  this.updateDataSource(); // Refresh the table
                  this.snackBar.open('User updated successfully!', 'Close', { duration: 3000 });
                }
              },
              error: (error: any) => {
                console.error('Error updating user on backend:', error);
                this.snackBar.open('Failed to update user. Please try again.', 'Close', { duration: 4000 });
              }
            });
        } else {
          console.log('Edit dialog closed without data (cancelled or no changes).');
        }
      });
  }

  onDelete(personToDelete: Associate): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot delete user. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    if (confirm(`Are you sure you want to delete ${personToDelete.associateName}?`)) {
      // For deletion, you'd typically call a service method like this:
      this.adminService.deleteUser('delete', personToDelete.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log(`${personToDelete.associateName} deleted from backend.`);
            this.currentPeople = this.currentPeople.filter(p => p.associateId !== personToDelete.associateId);
            this.updateDataSource();
            this.snackBar.open('User deleted successfully!', 'Close', { duration: 3000 });
          },
          error: (error: any) => {
            console.error(`Error deleting ${personToDelete.associateName} from backend:`, error);
            this.snackBar.open('Failed to delete user. Please try again.', 'Close', { duration: 4000 });
          }
        });
      // If not integrating backend delete yet, keep local filter:
      this.currentPeople = this.currentPeople.filter(p => p.associateId !== personToDelete.associateId);
      this.updateDataSource(); // Call a helper to update and filter
      console.log(`${personToDelete.associateName} deleted (locally for now).`);
    }
  }

  private updateDataSource(): void {
    this.dataSource.data = [...this.currentPeople];
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
