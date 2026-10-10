

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Import Observable
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule for the dropdown

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// --- CRITICAL FIX: Correct import path for ServiceLine model ---
//import { ServiceLine } from 'src/app/models/serviceline.model'; // THIS IS THE CORRECT PATH AND FILENAME
// --- CRITICAL CHANGE: Import Domain model and DomainService for the dropdown ---
import { Domain } from 'src/app/models/domain.model'; // Ensure this path is correct
import { DomainService } from 'src/app/services/domain.service'; // Ensure this path is correct
import { ServiceLine } from 'src/app/models/serviceLine.model';

@Component({
  selector: 'app-add-edit-service-line-dialog',
  templateUrl: './add-edit-service-line-dialog.component.html',
  styleUrls: ['./add-edit-service-line-dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule, // Add MatSelectModule to imports
  ],
})
export class AddEditServiceLineDialogComponent implements OnInit {
  serviceLineForm!: FormGroup;
  isEditMode: boolean = false;
  dialogTitle: string = ''; // Added to dynamically set the dialog title
  domains$!: Observable<Domain[]>; // Observable to hold the list of domains for the dropdown

  constructor(
    public dialogRef: MatDialogRef<AddEditServiceLineDialogComponent>,
    // --- CRITICAL CHANGE: Data type is 'ServiceLine | null' ---
    @Inject(MAT_DIALOG_DATA) public data: ServiceLine | null, // Data can be a ServiceLine object or null
    // --- CRITICAL CHANGE: Inject DomainService to fetch domains ---
    private domainService: DomainService
  ) { }

  ngOnInit(): void {
    // Determine if in edit mode based on whether data is provided and has a serviceLineId
    // If data is null (add mode), or serviceLineId is not defined/null, it's add mode.
    // If data is present AND serviceLineId is defined and not null, it's edit mode.
    this.isEditMode = !!this.data && this.data.serviceLineId !== undefined && this.data.serviceLineId !== null;
    this.dialogTitle = this.isEditMode ? 'Edit Service Line' : 'Add New Service Line';

    // --- CRITICAL CHANGE: Fetch domains for the dropdown ---
    // Ensure your DomainService has a method named 'fetchDomains' that takes an endpoint
    this.domains$ = this.domainService.fetchDomains("all-domains"); // Assuming "all-domains" is the correct endpoint

    this.serviceLineForm = new FormGroup({
      // serviceLineId: Used for backend identification, disabled in edit mode, null for add.
      // We keep this in the form because the backend returns it and it's part of the ServiceLine model.
      // It's just not used in the URL for update/delete, but is part of the payload.
      serviceLineId: new FormControl(
        { value: this.isEditMode ? this.data!.serviceLineId : null, disabled: this.isEditMode },
        this.isEditMode ? Validators.required : null // Required only if editing an existing record
      ),
      // trackName is the key for identifying service lines for update/delete operations in the backend
      trackName: new FormControl(this.isEditMode ? this.data!.trackName : '', Validators.required),
      // domainName is for associating the service line with a domain
      domainName: new FormControl(this.isEditMode ? this.data!.domainName : '', Validators.required),
    });
  }

  /**
   * Handles the save action for the dialog.
   * If the form is valid, it closes the dialog and returns the constructed ServiceLine object.
   */
  onSave(): void {
    if (this.serviceLineForm.valid) {
      // Get all values, including disabled ones like serviceLineId in edit mode.
      const formValue = this.serviceLineForm.getRawValue();

      // Construct the result as a 'ServiceLine' object, as expected by the service.
      const result: ServiceLine = {
        serviceLineId: formValue.serviceLineId, // This will be 'number' for edit, or 'null' for add
        trackName: formValue.trackName,
        domainName: formValue.domainName, // The selected domain name from the dropdown
      };

      // If in add mode and serviceLineId is null, remove it so backend can auto-generate the ID
      // This is crucial if your backend's POST method for adding expects no ID for new entities.
      // if (!this.isEditMode && result.serviceLineId === null) {
      //     delete result.serviceLineId;
      // }

      this.dialogRef.close(result); // Close the dialog, passing the 'ServiceLine' object
    } else {
      // If form is invalid, mark all controls as touched to display validation errors
      this.serviceLineForm.markAllAsTouched();
    }
  }

  /**
   * Handles the cancel action for the dialog.
   * Closes the dialog without returning any data.
   */
  onCancel(): void {
    this.dialogRef.close(null); // Close dialog without returning data
  }
}