import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Import your Location model
//import { Location } from 'src/app/models/class/location.model';
import { Location } from 'src/app/models/location.model';

@Component({
  selector: 'app-add-edit-location-dialog',
  templateUrl: './add-edit-location-dialog.component.html',
  styleUrls: ['./add-edit-location-dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AddEditLocationDialogComponent implements OnInit {
  locationForm!: FormGroup;
  isEditMode: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<AddEditLocationDialogComponent>,
    // Data for editing (optional, null for add mode).
    // In add mode, we expect a string (new location name).
    // In edit mode, we expect a Location object.
    @Inject(MAT_DIALOG_DATA) public data: Location | null
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data && typeof this.data !== 'string'; // Check if data is a Location object

    this.locationForm = new FormGroup({
      // sno field: Displayed in edit mode but disabled as it's auto-generated. Not part of form in add mode.
      sno: new FormControl({ value: this.isEditMode ? (this.data as Location).locationId : null, disabled: false }),
      // locationName field: Required for both add and edit
      locationName: new FormControl(this.isEditMode ? (this.data as Location).location : '', Validators.required),
    });
  }

  /**
   * Handles the save action for the dialog.
   * If the form is valid, it closes the dialog and returns the form's data.
   */
  onSave(): void {
    if (this.locationForm.valid) {
      if (this.isEditMode) {
        // For edit mode, return the full Location object including the immutable sno
        const updatedLocation: Location = {
          locationId: (this.data as Location).locationId, // Use the original sno
          location: this.locationForm.get('locationName')?.value
        };
        this.dialogRef.close(updatedLocation);
      } else {
        // For add mode, only return the new location name string
        this.dialogRef.close(this.locationForm.get('locationName')?.value);
      }
    } else {
      // If form is invalid, mark all controls as touched to display validation errors
      this.locationForm.markAllAsTouched();
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


