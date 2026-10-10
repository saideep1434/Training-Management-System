// import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';

// import { FormsModule } from '@angular/forms';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';

// import { AddEditDomainDialogComponent } from './add-edit-domain-dialog/add-edit-domain-dialog.component';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
// import { Domain } from 'src/app/models/class/domain.model';
// import { ServiceLine } from 'src/app/models/class/serviceline.model';

// import { ManageDomainServiceLinesDialogComponent } from './manage-domain-service-lines-dialog/manage-domain-service-lines-dialog.component';

// @Component({
//   selector: 'app-domain-list',
//   templateUrl: './domain.component.html',
//   styleUrls: ['./domain.component.scss'],
//   standalone: true,
//   imports: [
//     FormsModule,
//     CommonModule,
//     MatDialogModule,
//     MatIconModule,
//     MatButtonModule,
//     MatInputModule,
//     MatFormFieldModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatSortModule,
//   ]
// })
// export class DomainComponent implements OnInit, AfterViewInit {
//   displayedColumns: string[] = ['serialNo', 'domainId', 'domainName', 'actions'];
//   dataSource: MatTableDataSource<Domain>;

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   searchQuery: string = ''; // For general search within the domain table

//   currentDomainData: Domain[] = [
//     { serialNo: 1, domainId: 'D001', domainName: 'Web Development',
//       serviceLines: [
//         { id: 'WEB-FE', name: 'Frontend Dev', description: 'React, Angular, Vue' },
//         { id: 'WEB-BE', name: 'Backend Dev', description: 'Node.js, Python, Java' }
//       ]
//     },
//     { serialNo: 2, domainId: 'D002', domainName: 'Quality Assurance Engineering',
//       serviceLines: [
//         { id: 'QA-SDET', name: 'SDET', description: 'Software Development Engineer in Test' },
//         { id: 'QA-SELENIUM', name: 'Selenium Automation', description: 'Automated web testing with Selenium' },
//         { id: 'QA-PLAYWRIGHT', name: 'Playwright Automation', description: 'Automated web testing with Playwright' },
//         { id: 'QA-MANUAL', name: 'Manual Testing', description: 'Manual functional and exploratory testing' }
//       ]
//     },
//     { serialNo: 3, domainId: 'D003', domainName: 'Dot Net',
//       serviceLines: [
//         { id: 'NET-CORE', name: '.NET Core Development', description: 'Building applications with .NET Core' },
//         { id: 'NET-MVC', name: '.NET MVC Development', description: 'Building web applications with ASP.NET MVC' }
//       ]
//     },
//     { serialNo: 4, domainId: 'D004', domainName: 'Cloud Computing',
//       serviceLines: [
//         { id: 'CLOUD-AWS', name: 'AWS Cloud Services', description: 'Amazon Web Services solutions' },
//         { id: 'CLOUD-AZURE', name: 'Azure Cloud Services', description: 'Microsoft Azure solutions' },
//         { id: 'CLOUD-GCP', name: 'GCP Cloud Services', description: 'Google Cloud Platform solutions' }
//       ]
//     },
//     { serialNo: 5, domainId: 'D005', domainName: 'DevOps',
//       serviceLines: [
//         { id: 'DEVOPS-CICD', name: 'CI/CD Pipelines', description: 'Continuous Integration/Continuous Deployment' },
//         { id: 'DEVOPS-INFRA', name: 'Infrastructure as Code', description: 'Terraform, CloudFormation' }
//       ]
//     },
//     { serialNo: 6, domainId: 'D006', domainName: 'Mainframe',
//       serviceLines: [
//         { id: 'MF-COBOL', name: 'COBOL Development', description: 'Legacy system development' },
//         { id: 'MF-DB2', name: 'DB2 Database Admin', description: 'Mainframe database management' }
//       ]
//     },
//     { serialNo: 7, domainId: 'D007', domainName: 'Cybersecurity',
//       serviceLines: [
//         { id: 'CYBER-PENTEST', name: 'Penetration Testing', description: 'Security vulnerability assessment' },
//         { id: 'CYBER-SECARCH', name: 'Security Architecture', description: 'Designing secure systems' }
//       ]
//     },
//     { serialNo: 8, domainId: 'D008', domainName: 'Artificial Intelligence',
//       serviceLines: [
//         { id: 'AI-ML', name: 'Machine Learning Engineering', description: 'Developing ML models' },
//         { id: 'AI-NLP', name: 'Natural Language Processing', description: 'Text and speech processing' }
//       ]
//     },
//     { serialNo: 9, domainId: 'D009', domainName: 'Machine Learning',
//       serviceLines: [
//         { id: 'ML-DL', name: 'Deep Learning', description: 'Neural networks development' },
//         { id: 'ML-OPS', name: 'MLOps', description: 'Deployment and management of ML models' }
//       ]
//     },
//     { serialNo: 10, domainId: 'D010', domainName: 'Data Science',
//       serviceLines: [
//         { id: 'DS-ANALYTICS', name: 'Data Analytics', description: 'Data interpretation and visualization' },
//         { id: 'DS-ENGINEERING', name: 'Data Engineering', description: 'Building data pipelines' }
//       ]
//     },
//   ];

//   constructor(private dialog: MatDialog) {
//     this.dataSource = new MatTableDataSource(this.currentDomainData);
//   }

//   ngOnInit() {
//     // Set up the filter predicate once on initialization
//     this.dataSource.filterPredicate = (data: Domain, filter: string) => {
//       const textFilter = filter.toLowerCase();
//       const serialNoMatch = data.serialNo.toString().includes(textFilter);
//       const domainIdMatch = data.domainId.toLowerCase().includes(textFilter);
//       const domainNameMatch = data.domainName.toLowerCase().includes(textFilter);
//       // Optional: search within service lines too
//       const serviceLineMatch = data.serviceLines.some(sl =>
//         sl.name.toLowerCase().includes(textFilter) ||
//         sl.id.toLowerCase().includes(textFilter) ||
//         (sl.description?.toLowerCase().includes(textFilter) || false) // Ensure boolean return
//       );
//       return serialNoMatch || domainIdMatch || domainNameMatch || serviceLineMatch;
//     };
//     this.applyFilters();
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

//   applyFilters() {
//     this.dataSource.filter = this.searchQuery.trim().toLowerCase();
//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }

//   onPageChange(event: any) {
//     console.log('Domain table page changed:', event);
//   }

//   addDomain(): void {
//     const dialogRef = this.dialog.open(AddEditDomainDialogComponent, {
//       width: '400px',
//       disableClose: true,
//       data: null // No initial data for adding
//     });

//     dialogRef.afterClosed().subscribe((newDomain: Domain) => {
//       if (newDomain) {
//         console.log('Dialog closed with new domain data:', newDomain);
//         const maxSerialNo = this.currentDomainData.reduce((max, d) => Math.max(max, d.serialNo), 0);
//         newDomain.serialNo = maxSerialNo + 1; // Assign a new serial number
//         newDomain.serviceLines = []; // Initialize empty serviceLines array for new domains

//         this.currentDomainData.push(newDomain);
//         this.updateDataSource();
//         this.dataSource.paginator?.lastPage();
//       } else {
//         console.log('Add domain dialog closed without data (cancelled).');
//       }
//     });
//   }

//   onEditDomain(domainToEdit: Domain): void {
//     const dialogRef = this.dialog.open(AddEditDomainDialogComponent, {
//       width: '400px',
//       disableClose: true,
//       data: { ...domainToEdit } // Pass a copy of the domain data for editing
//     });

//     dialogRef.afterClosed().subscribe((updatedDomain: Domain) => {
//       if (updatedDomain) {
//         console.log('Dialog closed with updated domain data:', updatedDomain);
//         const index = this.currentDomainData.findIndex(d => d.serialNo === updatedDomain.serialNo);
//         if (index !== -1) {
//           this.currentDomainData[index] = {
//             ...this.currentDomainData[index], // Original domain data (to preserve serviceLines)
//             ...updatedDomain // Overwrite basic properties from the dialog
//           };
//           this.updateDataSource();
//         }
//       } else {
//         console.log('Edit domain dialog closed without data (cancelled or no changes).');
//       }
//     });
//   }

//   onDeleteDomain(domainToDelete: Domain): void {
//     // Replaced native confirm with a placeholder for a Material Dialog-based confirmation
//     // In a real app, you'd open a MatDialog for confirmation here.
//     if (window.confirm(`Are you sure you want to delete domain "${domainToDelete.domainName}" (ID: ${domainToDelete.domainId})? This will also delete all associated service lines.`)) {
//       this.currentDomainData = this.currentDomainData.filter(d => d.serialNo !== domainToDelete.serialNo);
//       this.updateDataSource();
//       console.log(`Domain "${domainToDelete.domainName}" deleted.`);
//     }
//   }

//   /**
//    * NEW: Method to open a dialog for managing service lines of a specific domain.
//    * @param domain The domain for which to manage service lines.
//    */
//   onManageServiceLines(domain: Domain): void {
//     console.log('Managing service lines for domain:', domain.domainName);
//     const dialogRef = this.dialog.open(ManageDomainServiceLinesDialogComponent, {
//       width: '800px', // Wider dialog for service line table
//       height: '600px', // Adjust height as needed
//       disableClose: true,
//       data: { domain: { ...domain } } // Pass a deep copy of the domain to the dialog
//     });

//     dialogRef.afterClosed().subscribe((updatedDomain: Domain) => {
//       if (updatedDomain) {
//         console.log('Manage Service Lines dialog closed with updated domain:', updatedDomain);
//         // Find the original domain in currentDomainData and update its serviceLines
//         const index = this.currentDomainData.findIndex(d => d.serialNo === updatedDomain.serialNo);
//         if (index !== -1) {
//           this.currentDomainData[index].serviceLines = updatedDomain.serviceLines;
//           this.updateDataSource(); // Refresh the table to reflect any changes (e.g., if filter depends on service lines)
//         }
//       } else {
//         console.log('Manage Service Lines dialog closed without changes.');
//       }
//     });
//   }

//   private updateDataSource(): void {
//     this.dataSource.data = [...this.currentDomainData];
//     this.applyFilters();
//   }
// }

// import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { FormsModule } from '@angular/forms';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar

// // Material Imports
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';

// // Import your Domain model and DomainService
// import { Domain, DomainApiResponse } from 'src/app/models/domain.model'; // Adjust path if using 'class' folder
// import { DomainService } from 'src/app/services/domain.service'; // Import your DomainService

// // Import the dialog components
// import { AddEditDomainDialogComponent } from './add-edit-domain-dialog/add-edit-domain-dialog.component';
// import { ManageDomainServiceLinesDialogComponent } from './manage-domain-service-lines-dialog/manage-domain-service-lines-dialog.component';


// @Component({
//   selector: 'app-domain-list',
//   templateUrl: './domain.component.html', // Assuming this is correct
//   styleUrls: ['./domain.component.scss'],
//   standalone: true,
//   imports: [
//     FormsModule,
//     CommonModule,
//     MatDialogModule,
//     MatIconModule,
//     MatButtonModule,
//     MatInputModule,
//     MatFormFieldModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatSortModule,
//     MatSnackBarModule, // Add MatSnackBarModule here
//   ]
// })
// export class DomainComponent implements OnInit, AfterViewInit {
//   displayedColumns: string[] = ['serialNo', 'domainId', 'domainName', 'actions'];
//   dataSource: MatTableDataSource<Domain> = new MatTableDataSource<Domain>(); // Initialize directly

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   searchQuery: string = '';

//   constructor(
//     private dialog: MatDialog,
//     private domainService: DomainService, // Inject DomainService
//     private snackBar: MatSnackBar // Inject MatSnackBar
//   ) {}

//   ngOnInit() {
//     this.loadDomainDetails(); // Load data from backend on init

//     this.dataSource.filterPredicate = (data: Domain, filter: string) => {
//       const textFilter = filter.toLowerCase();
//       // serialNo is display-only, so filter only on data properties from backend
//       const domainIdMatch = data.domainId.toLowerCase().includes(textFilter);
//       const domainNameMatch = data.domainName.toLowerCase().includes(textFilter);
//       // Optional: search within service lines too
//       const serviceLineMatch = data.serviceLines.some(sl =>
//         sl.name.toLowerCase().includes(textFilter) ||
//         sl.id.toLowerCase().includes(textFilter) ||
//         (sl.description?.toLowerCase().includes(textFilter) || false) // Ensure boolean return
//       );
//       return domainIdMatch || domainNameMatch || serviceLineMatch;
//     };
//     // No need to call applyFilters here, loadDomainDetails will populate dataSource
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

//   applyFilters() {
//     this.dataSource.filter = this.searchQuery.trim().toLowerCase();
//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }

//   onPageChange(event: any) {
//     console.log('Domain table page changed:', event);
//   }

//   /**
//    * Fetches domain details from the DomainService and populates the dataSource.
//    */
//   loadDomainDetails(): void {
//     this.domainService.fetchDomains('all').subscribe({ // Assuming 'all' is your endpoint for fetching all domains
//       next: (domains: Domain[]) => {
//         this.dataSource.data = domains;
//         console.log("Domain details fetched successfully:", this.dataSource.data);
//       },
//       error: (err: any) => {
//         this.snackBar.open('Failed to load domains. Please try again later.', 'Close', { duration: 5000 });
//         console.error('DomainComponent: Error fetching domains:', err);
//       },
//       complete: () => {
//         console.log('DomainComponent: Domains fetch completed.');
//       }
//     });
//   }

//   addDomain(): void {
//     const dialogRef = this.dialog.open(AddEditDomainDialogComponent, {
//       width: '400px',
//       disableClose: true,
//       data: null // No initial data for adding
//     });

//     dialogRef.afterClosed().subscribe((newDomainData: Domain) => {
//       if (newDomainData) {
//         console.log('Dialog closed with new domain data:', newDomainData);

//         // Call the service to add the domain to the backend
//         this.domainService.addDomain(newDomainData).subscribe({
//           next: (response) => {
//             if (response.status === 201) { // Assuming 201 Created for successful addition
//               this.snackBar.open(response.message, 'Close', { duration: 3000 });
//               this.loadDomainDetails(); // Re-fetch all domains to update the table
//             } else {
//               this.snackBar.open(response.message || 'Error adding domain.', 'Close', { duration: 5000 });
//             }
//           },
//           error: (err) => {
//             this.snackBar.open('Failed to add domain. Please try again.', 'Close', { duration: 5000 });
//             console.error('Error adding domain to backend:', err);
//           }
//         });
//       } else {
//         console.log('Add domain dialog closed without data (cancelled).');
//       }
//     });
//   }

//   onEditDomain(domainToEdit: Domain): void {
//     const dialogRef = this.dialog.open(AddEditDomainDialogComponent, {
//       width: '400px',
//       disableClose: true,
//       data: { ...domainToEdit } // Pass a copy of the domain data for editing
//     });

//     dialogRef.afterClosed().subscribe((updatedDomainFromDialog: Domain) => {
//       if (updatedDomainFromDialog && updatedDomainFromDialog.domainId) { // Ensure ID exists for update
//         console.log('Dialog closed with updated domain data:', updatedDomainFromDialog);

//         // Call the service to update the domain on the backend
//         this.domainService.updateDomain(updatedDomainFromDialog.domainId, updatedDomainFromDialog).subscribe({ // Assuming update by domainId
//           next: (response) => {
//             if (response.status === 200) { // Assuming 200 OK for successful update
//               this.snackBar.open(response.message, 'Close', { duration: 3000 });
//               this.loadDomainDetails(); // Re-fetch the entire list
//             } else {
//               this.snackBar.open(response.message || 'Error updating domain.', 'Close', { duration: 5000 });
//             }
//           },
//           error: (err) => {
//             this.snackBar.open('Failed to update domain. Please try again.', 'Close', { duration: 5000 });
//             console.error('Error updating domain on backend:', err);
//           }
//         });
//       } else {
//         console.log('Edit domain dialog closed without data (cancelled or no changes, or no ID for update).');
//       }
//     });
//   }

//   onDeleteDomain(domainToDelete: Domain): void {
//     if (confirm(`Are you sure you want to delete domain "${domainToDelete.domainName}" (ID: ${domainToDelete.domainId})? This will also delete all associated service lines.`)) {
//       // Call the service to delete the domain from the backend
//       this.domainService.deleteDomain(domainToDelete.domainId).subscribe({ // Assuming delete by domainId
//         next: (response) => {
//           if (response.status === 200) { // Assuming 200 OK for successful delete
//             this.snackBar.open(response.message, 'Close', { duration: 3000 });
//             this.loadDomainDetails(); // Re-fetch the entire list
//           } else {
//             this.snackBar.open(response.message || 'Error deleting domain.', 'Close', { duration: 5000 });
//           }
//         },
//         error: (err) => {
//           this.snackBar.open('Failed to delete domain. Please try again.', 'Close', { duration: 5000 });
//           console.error('Error deleting domain from backend:', err);
//         }
//       });
//     }
//   }

//   /**
//    * NEW: Method to open a dialog for managing service lines of a specific domain.
//    * This still operates on the frontend data structure as service line management is client-side for now.
//    * You'll need a ServiceLineService if you want to manage them via backend API.
//    * @param domain The domain for which to manage service lines.
//    */
//   onManageServiceLines(domain: Domain): void {
//     console.log('Managing service lines for domain:', domain.domainName);
//     const dialogRef = this.dialog.open(ManageDomainServiceLinesDialogComponent, {
//       width: '800px', // Wider dialog for service line table
//       height: '600px', // Adjust height as needed
//       disableClose: true,
//       data: { domain: { ...domain } } // Pass a deep copy of the domain to the dialog
//     });

//     dialogRef.afterClosed().subscribe((updatedDomain: Domain) => {
//       if (updatedDomain) {
//         console.log('Manage Service Lines dialog closed with updated domain:', updatedDomain);
//         // Find the original domain in dataSource.data (since currentDomainData is removed)
//         const index = this.dataSource.data.findIndex(d => d.domainId === updatedDomain.domainId); // Use domainId for lookup
//         if (index !== -1) {
//           // Update the serviceLines property of the specific domain in the dataSource
//           this.dataSource.data[index].serviceLines = updatedDomain.serviceLines;
//           this.updateDataSource(); // Refresh the table
//           this.snackBar.open('Service lines updated successfully!', 'Close', { duration: 3000 });
//         }
//       } else {
//         console.log('Manage Service Lines dialog closed without changes.');
//       }
//     });
//   }

//   /**
//    * Helper method to refresh the MatTableDataSource after data changes.
//    * It's crucial to assign a new array reference for the table to detect changes.
//    */
//   private updateDataSource(): void {
//     this.dataSource.data = [...this.dataSource.data]; // Create a new array reference from current data
//     this.applyFilters(); // Re-apply filters to ensure correct display after data modification
//   }
// }
// import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { FormsModule } from '@angular/forms';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// // Material Imports
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';

// // Import your Domain model and DomainService
// import { Domain, DomainApiResponse } from 'src/app/models/domain.model'; // Use the simplified Domain model
// import { DomainService } from 'src/app/services/domain.service';

// // Import the dialog component for Add/Edit
// import { AddEditDomainDialogComponent } from './add-edit-domain-dialog/add-edit-domain-dialog.component';

// @Component({
//   selector: 'app-domain-list',
//   templateUrl: './domain.component.html',
//   styleUrls: ['./domain.component.scss'],
//   standalone: true,
//   imports: [
//     FormsModule,
//     CommonModule,
//     MatDialogModule,
//     MatIconModule,
//     MatButtonModule,
//     MatInputModule,
//     MatFormFieldModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatSortModule,
//     MatSnackBarModule,
//   ]
// })
// export class DomainComponent implements OnInit, AfterViewInit {
//   // Only serialNo and domainName, as domainId is not used and serviceLines are removed
//   displayedColumns: string[] = ['serialNo', 'domainName', 'actions'];
//   dataSource: MatTableDataSource<Domain> = new MatTableDataSource<Domain>();

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   searchQuery: string = '';

//   constructor(
//     private dialog: MatDialog,
//     private domainService: DomainService,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit() {
//     this.loadDomainDetails();

//     // The filter predicate now only considers 'domainName'
//     this.dataSource.filterPredicate = (data: Domain, filter: string) => {
//       const textFilter = filter.toLowerCase();
//       const domainNameMatch = data.domainName.toLowerCase().includes(textFilter);
//       return domainNameMatch;
//     };
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

//   applyFilters() {
//     this.dataSource.filter = this.searchQuery.trim().toLowerCase();
//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }

//   onPageChange(event: any) {
//     console.log('Domain table page changed:', event);
//   }

//   /**
//    * Fetches domain details from the DomainService and populates the dataSource.
//    */
//   loadDomainDetails(): void {
//     this.domainService.fetchDomains('all-domains').subscribe({
//       next: (domains: Domain[]) => {
//         // Assign serial numbers for display purposes after fetching data
//         this.dataSource.data = domains.map((domain, index) => ({
//           ...domain,
//           serialNo: index + 1 // Add a serialNo for display
//         }));
//         console.log("Domain details fetched successfully:", this.dataSource.data);
//       },
//       error: (err: any) => {
//         this.snackBar.open('Failed to load domains. Please try again later.', 'Close', { duration: 5000 });
//         console.error('DomainComponent: Error fetching domains:', err);
//       },
//       complete: () => {
//         console.log('DomainComponent: Domains fetch completed.');
//       }
//     });
//   }

//   addDomain(): void {
//     const dialogRef = this.dialog.open(AddEditDomainDialogComponent, {
//       width: '400px',
//       disableClose: true,
//       data: null // No initial data for adding
//     });

//     dialogRef.afterClosed().subscribe((newDomainData: Domain) => {
//       if (newDomainData) {
//         console.log('Dialog closed with new domain data:', newDomainData);

//         // Call the service to add the domain to the backend
//         this.domainService.addDomain(newDomainData).subscribe({
//           next: (response) => {
//             if (response.status === 201) {
//               this.snackBar.open(response.message, 'Close', { duration: 3000 });
//               this.loadDomainDetails(); // Re-fetch all domains to update the table
//             } else {
//               this.snackBar.open(response.message || 'Error adding domain.', 'Close', { duration: 5000 });
//             }
//           },
//           error: (err) => {
//             this.snackBar.open('Failed to add domain. Please try again.', 'Close', { duration: 5000 });
//             console.error('Error adding domain to backend:', err);
//           }
//         });
//       } else {
//         console.log('Add domain dialog closed without data (cancelled).');
//       }
//     });
//   }

//   onEditDomain(domainToEdit: Domain): void {
//     const dialogRef = this.dialog.open(AddEditDomainDialogComponent, {
//       width: '400px',
//       disableClose: true,
//       data: { ...domainToEdit } // Pass a copy of the domain data for editing
//     });

//     dialogRef.afterClosed().subscribe((updatedDomainFromDialog: Domain) => {
//       if (updatedDomainFromDialog && updatedDomainFromDialog.domainName) {
//         console.log('Dialog closed with updated domain data:', updatedDomainFromDialog);

//         // Find the original domain in the current data source by its *original* domainName
//         const originalDomain = this.dataSource.data.find(d => d.domainName === domainToEdit.domainName);

//         if (originalDomain) {
//           // Pass the original domainName to the update service, as the updatedDomainFromDialog might have a new name
//           this.domainService.updateDomain(originalDomain.domainName, updatedDomainFromDialog.domainName).subscribe({
//             next: (response) => {
//               if (response.status === 200) {
//                 this.snackBar.open(response.message, 'Close', { duration: 3000 });
//                 this.loadDomainDetails(); // Re-fetch the entire list
//               } else {
//                 this.snackBar.open(response.message || 'Error updating domain.', 'Close', { duration: 5000 });
//               }
//             },
//             error: (err) => {
//               this.snackBar.open('Failed to update domain. Please try again.', 'Close', { duration: 5000 });
//               console.error('Error updating domain on backend:', err);
//             }
//           });
//         } else {
//           this.snackBar.open('Original domain not found for update.', 'Close', { duration: 5000 });
//         }
//       } else {
//         console.log('Edit domain dialog closed without data (cancelled or no changes, or no domainName for update).');
//       }
//     });
//   }

//   onDeleteDomain(domainToDelete: Domain): void {
//     if (confirm(`Are you sure you want to delete domain "${domainToDelete.domainName}"?`)) {
//       // Use domainName for identification
//       this.domainService.deleteDomain(domainToDelete.domainName).subscribe({
//         next: (response) => {
//           if (response.status === 200) {
//             this.snackBar.open(response.message, 'Close', { duration: 3000 });
//             this.loadDomainDetails(); // Re-fetch the entire list
//           } else {
//             this.snackBar.open(response.message || 'Error deleting domain.', 'Close', { duration: 5000 });
//           }
//         },
//         error: (err) => {
//           this.snackBar.open('Failed to delete domain. Please try again.', 'Close', { duration: 5000 });
//           console.error('Error deleting domain from backend:', err);
//         }
//       });
//     }
//   }

//   private updateDataSource(): void {
//     // Re-apply serial numbers after any data modification for display consistency
//     this.dataSource.data = this.dataSource.data.map((domain, index) => ({
//       ...domain,
//       serialNo: index + 1
//     }));
//     this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
//     this.applyFilters();
//   }
// }


// src/app/components/domain-list/domain.component.ts
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Import your specific Domain model
import { Domain } from 'src/app/models/domain.model';
import { DomainService } from 'src/app/services/domain.service';
import { StorageService } from 'src/app/services/storage.service';

// Import the dialog component for Add/Edit
import { AddEditDomainDialogComponent } from './add-edit-domain-dialog/add-edit-domain-dialog.component';

@Component({
  selector: 'app-domain-list',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss'],
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
    MatSnackBarModule,
  ]
})
export class DomainComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['serialNo', 'domainName', 'actions'];
  dataSource: MatTableDataSource<Domain> = new MatTableDataSource<Domain>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchQuery: string = '';
  isReadOnly = false;
  canManageAdminSettings = false;
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private domainService: DomainService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isReadOnly = StorageService.isReadOnly();
    this.canManageAdminSettings = StorageService.canManageAdminSettings();
    this.loadDomainDetails();
    this.dataSource.filterPredicate = (data: Domain, filter: string) => {
      const textFilter = filter.toLowerCase();
      const domainNameMatch = data.domainName.toLowerCase().includes(textFilter);
      return domainNameMatch;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: any) {
    console.log('Domain table page changed:', event);
  }

  /**
   * Fetches domain details from the DomainService and populates the dataSource.
   */
  loadDomainDetails(): void {
    // Pass the specific endpoint for fetching all domains
    this.domainService.fetchDomains('all-domains')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (domains: Domain[]) => {
          this.dataSource.data = domains.map((domain, index) => ({
            ...domain,
            serialNo: index + 1
          }));
          console.log("Domain details fetched successfully:", this.dataSource.data);
        },
        error: (err: any) => {
          this.snackBar.open('Failed to load domains. Please try again later.', 'Close', { duration: 5000 });
          console.error('DomainComponent: Error fetching domains:', err);
        },
        complete: () => {
          console.log('DomainComponent: Domains fetch completed.');
        }
      });
  }

  addDomain(): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot add domain. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    if (!this.canManageAdminSettings) {
      this.snackBar.open('You do not have permission to add domains. Only Admin users can manage admin settings.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    const dialogRef = this.dialog.open(AddEditDomainDialogComponent, {
      width: '400px',
      disableClose: true,
      data: null // No initial data for adding
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newDomainData: Domain) => {
        if (newDomainData && newDomainData.domainName) {
          console.log('Dialog closed with new domain data:', newDomainData);

          this.domainService.addDomain(newDomainData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response: any) => {
                if (response.status === 201) {
                  this.snackBar.open(response.message, 'Close', { duration: 3000 });
                  this.loadDomainDetails();
                } else {
                  this.snackBar.open(response.message || 'Error adding domain.', 'Close', { duration: 5000 });
                }
              },
              error: (err) => {
                this.snackBar.open('Failed to add domain. Please try again.', 'Close', { duration: 5000 });
                console.error('Error adding domain to backend:', err);
              }
            });
        } else {
          console.log('Add domain dialog closed without data (cancelled or no domainName).');
        }
      });
  }

  onEditDomain(domainToEdit: Domain): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot edit domain. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    const dialogRef = this.dialog.open(AddEditDomainDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { ...domainToEdit } // Pass a copy of the domain data for editing
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedDomainFromDialog: Domain) => {
        if (updatedDomainFromDialog && updatedDomainFromDialog.domainName) {
          console.log('Dialog closed with updated domain data:', updatedDomainFromDialog);

          // Call the updateDomain method which uses updateByName
          // `domainToEdit.domainName` is the original name used to identify the domain for update.
          // `updatedDomainFromDialog` contains the potentially new domain name.
          this.domainService.updateDomain(domainToEdit.domainName, updatedDomainFromDialog)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response: any) => {
                if (response.status === 200) {
                  this.snackBar.open(response.message, 'Close', { duration: 3000 });
              this.loadDomainDetails();
            } else {
              this.snackBar.open(response.message || 'Error updating domain.', 'Close', { duration: 5000 });
            }
          },
          error: (err) => {
            this.snackBar.open('Failed to update domain. Please try again.', 'Close', { duration: 5000 });
            console.error('Error updating domain on backend:', err);
          }
        });
      } else {
        console.log('Edit domain dialog closed without data (cancelled or no changes, or no domainName for update).');
      }
    });
  }

  // onDeleteDomain(domainToDelete: Domain): void {
  //   if (domainToDelete.domainId === undefined || domainToDelete.domainId === null) {
  //     this.snackBar.open('Cannot delete: Domain ID is missing.', 'Close', { duration: 5000 });
  //     console.error('DomainComponent: Attempted to delete domain without an ID.', domainToDelete);
  //     return;
  //   }

  //   if (confirm(`Are you sure you want to delete domain "${domainToDelete.domainName}"?`)) {
  //     this.domainService.deleteDomain(domainToDelete.domainId).subscribe({
  //       next: (response: any) => {
  //         if (response.status === 200) {
  //           this.snackBar.open(response.message, 'Close', { duration: 3000 });
  //           this.loadDomainDetails();
  //         } else {
  //           this.snackBar.open(response.message || 'Error deleting domain.', 'Close', { duration: 5000 });
  //         }
  //       },
  //       error: (err) => {
  //         this.snackBar.open('Failed to delete domain. Please try again.', 'Close', { duration: 5000 });
  //         console.error('Error deleting domain from backend:', err);
  //       }
  //     });
  //   }
  // }



  onDeleteDomain(domainToDelete: Domain): void {
    if (this.isReadOnly) {
      this.snackBar.open('Cannot delete domain. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    // if (domainToDelete.domainId === undefined || domainToDelete.domainId === null) {
    //   this.snackBar.open('Cannot delete: Domain ID is missing.', 'Close', { duration: 5000 });
    //   console.error('DomainComponent: Attempted to delete domain without an ID.', domainToDelete);
    //   return;
    // }

    if (confirm(`Are you sure you want to delete domain "${domainToDelete.domainName}"?`)) {
      this.domainService.deleteDomainName(domainToDelete.domainName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              this.snackBar.open(response.message, 'Close', { duration: 3000 });
              this.loadDomainDetails();
            } else {
              this.snackBar.open(response.message || 'Error deleting domain.', 'Close', { duration: 5000 });
            }
          },
          error: (err) => {
            this.snackBar.open('Failed to delete domain. Please try again.', 'Close', { duration: 5000 });
            console.error('Error deleting domain from backend:', err);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

