
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Import Observable for async pipe
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule for the dropdown

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Import your Vertical model
import { vertical } from 'src/app/models/vertical.model'; // Adjust path if needed
// --- NEW IMPORTS: Domain model and DomainService ---
import { Domain } from 'src/app/models/domain.model'; // Adjust path if needed
import { DomainService } from 'src/app/services/domain.service'; // Adjust path if needed

@Component({
  selector: 'app-add-edit-vertical-dialog',
  templateUrl: './add-edit-vertical-dialog.component.html',
  styleUrls: ['./add-edit-vertical-dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule, // Add MatSelectModule here
  ],
})
export class AddEditVerticalDialogComponent implements OnInit {
  verticalForm!: FormGroup;
  isEditMode: boolean = false;
  dialogTitle: string = ''; // To set the dialog title dynamically
  domains$!: Observable<Domain[]>; // Observable to hold the list of domains

  constructor(
    public dialogRef: MatDialogRef<AddEditVerticalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: vertical | null, // Data can be a Vertical object or null
    private domainService: DomainService // Inject the DomainService
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data && this.data.verticalId !== undefined; // Check if data is a Vertical object with an ID
    this.dialogTitle = this.isEditMode ? 'Edit Vertical' : 'Add New Vertical';

    // Fetch domains when the dialog initializes
    this.domains$ = this.domainService.fetchDomains("all-domains"); // Call your domain service method

    this.verticalForm = new FormGroup({
      // verticalId: Used for backend identification, disabled in edit mode, null for add.
      verticalId: new FormControl(
        { value: this.isEditMode ? this.data!.verticalId : null, disabled: this.isEditMode },
        this.isEditMode ? Validators.required : null // Required only if editing an existing record
      ),
      // verticalName: Required for both add and edit
      verticalName: new FormControl(this.isEditMode ? this.data!.verticalName : '', Validators.required),
      // --- NEW: domainName control for the dropdown selection ---
      domainName: new FormControl(this.isEditMode ? this.data!.domainName : '', Validators.required),
    });
  }

  /**
   * Handles the save action for the dialog.
   * If the form is valid, it closes the dialog and returns the constructed Vertical object.
   */
  onSave(): void {
    if (this.verticalForm.valid) {
      // Get all values, including disabled ones like verticalId in edit mode.
      const formValue = this.verticalForm.getRawValue();

      // Construct the result as a 'Vertical' object, as expected by the service.
      const result: vertical = {
        verticalId: formValue.verticalId, // This will be 'number' for edit, or 'null' for add
        verticalName: formValue.verticalName,
        domainName: formValue.domainName, // The selected domain name from the dropdown
      };

      // If in add mode and verticalId is null, remove it so backend can auto-generate
      // if (!this.isEditMode && result.verticalId === null) {
      //     delete result.verticalId;
      // }

      this.dialogRef.close(result); // Close the dialog, passing the 'Vertical' object
    } else {
      // If form is invalid, mark all controls as touched to display validation errors
      this.verticalForm.markAllAsTouched();
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