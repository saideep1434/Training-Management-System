
// import { Component, OnInit, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// // Material Imports
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';

// // NEW: Define ServiceLine interface
// export interface ServiceLine {
//   id: string; // Unique identifier for service line (e.g., 'QA-SDET', 'WEB-FE')
//   name: string;
//   description?: string;
// }

// // Updated: Define Domain interface to include serviceLines
// export interface Domain {
//   serialNo: number;
//   domainId: string;
//   domainName: string;
//   serviceLines: ServiceLine[]; // Added field
// }

// @Component({
//   selector: 'dialog-add-edit-domain',
//   templateUrl: './add-edit-domain-dialog.component.html',
//   styleUrls: ['./add-edit-domain-dialog.component.scss'],
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     CommonModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//   ],
// })
// export class AddEditDomainDialogComponent implements OnInit {
//   domainForm!: FormGroup;
//   isEditMode: boolean = false;

//   constructor(
//     public dialogRef: MatDialogRef<AddEditDomainDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: Domain // Data for editing (optional)
//   ) { }

//   ngOnInit(): void {
//     this.isEditMode = !!this.data;

//     this.domainForm = new FormGroup({
//       serialNo: new FormControl({ value: '', disabled: this.isEditMode }, [Validators.required, Validators.min(1)]),
//       domainId: new FormControl('', Validators.required),
//       domainName: new FormControl('', Validators.required),
//       // serviceLines is NOT part of this form, as it's managed separately in the expanded view
//     });

//     if (this.isEditMode) {
//       // Patch only the fields handled by this dialog
//       this.domainForm.patchValue({
//         serialNo: this.data.serialNo,
//         domainId: this.data.domainId,
//         domainName: this.data.domainName
//       });
//     }
//   }

//   onSave(): void {
//     if (this.domainForm.valid) {
//       if (this.domainForm.get('serialNo')?.disabled) {
//         this.domainForm.get('serialNo')?.enable();
//       }
//       const result: Domain = {
//         ...this.data, // Preserve existing serviceLines if editing
//         ...this.domainForm.value,
//         serviceLines: this.isEditMode ? this.data.serviceLines : [] // Initialize serviceLines if adding new domain
//       };
//       this.dialogRef.close(result);
//     } else {
//       this.domainForm.markAllAsTouched();
//     }
//   }

//   onCancel(): void {
//     this.dialogRef.close();
//   }
// }


import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Define ServiceLine interface (assuming it's used within Domain)
// If this is already defined in a shared model file (e.g., domain.model.ts),
// you should import it instead of redefining it here.
export interface ServiceLine {
  id: string; // Unique identifier for service line (e.g., 'QA-SDET', 'WEB-FE')
  name: string;
  description?: string;
}

// Define Domain interface (assuming it's used within Domain)
// If this is already defined in a shared model file, import it.
export interface Domain {
  serialNo?: number; // Made optional as it's typically client-side display
  domainId?: string;
  domainName: string;
  serviceLines: ServiceLine[]; // This field is part of the Domain model
}

@Component({
  selector: 'dialog-add-edit-domain', // Standard Angular naming convention for dialogs
  templateUrl: './add-edit-domain-dialog.component.html',
  styleUrls: ['./add-edit-domain-dialog.component.scss'],
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
export class AddEditDomainDialogComponent implements OnInit {
  domainForm!: FormGroup;
  isEditMode: boolean = false;
  dialogTitle: string = ''; // Initialize dialog title

  constructor(
    public dialogRef: MatDialogRef<AddEditDomainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Domain | null // data can be null for add mode
  ) { }

  ngOnInit(): void {
    // Determine if it's edit mode based on whether data is provided
    this.isEditMode = !!this.data;
    this.dialogTitle = this.isEditMode ? 'Edit Domain' : 'Add New Domain';

    this.domainForm = new FormGroup({
      // serialNo is display-only, NOT part of the form for backend submission
      // domainId should be read-only if editing
      // domainId: new FormControl(
      //   { value: this.isEditMode ? this.data!.domainId : '', disabled: this.isEditMode },
      //   Validators.required
      // ),
      domainName: new FormControl(this.isEditMode ? this.data!.domainName : '', Validators.required),
      // serviceLines is NOT part of this form, as it's managed separately (e.g., in ManageDomainServiceLinesDialogComponent)
    });
  }

  onSave(): void {
    if (this.domainForm.valid) {
      // Re-enable domainId if it was disabled (for edit mode) so its value is included
      // in form.value when sending back to the parent component.
      // Alternatively, use getRawValue() which includes disabled controls.
      // if (this.domainForm.get('domainId')?.disabled) {
      //   this.domainForm.get('domainId')?.enable();
      // }

      const formValue = this.domainForm.value; // Gets values from enabled controls

      // Construct the result, preserving serviceLines from the original data if editing
      const result: Domain = {
        // domainId: formValue.domainId,
        domainName: formValue.domainName,
        // If in edit mode, use existing serviceLines; otherwise, initialize an empty array.
        serviceLines: this.isEditMode && this.data ? this.data.serviceLines : []
      };

      this.dialogRef.close(result);
    } else {
      // Mark all form controls as touched to display validation errors
      this.domainForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}