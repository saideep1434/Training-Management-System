// src/app/add-person-details-dialog/add-person-details-dialog.component.ts

// import { Component, OnInit, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// // Material Imports for the dialog's UI
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSelectModule } from '@angular/material/select';

// import { ROLES, RoleValue } from 'src/app/shared/constants/roles';
// import { Associate } from 'src/app/models/Person.model'; // This model needs to be updated

// @Component({
//   selector: 'dialog-add-person-details-dialog',
//   templateUrl: './add-person-details-dialog.component.html',
//   styleUrls: ['./add-person-details-dialog.component.scss'],
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatSelectModule,
//     MatDialogModule,
//     CommonModule,
//   ],
// })
// export class AddPersonDetailsDialogComponent implements OnInit {
//   personForm!: FormGroup;
//   rolesList = Object.values(ROLES);

//   // Property to control the visibility of the additional input field
//   showAdditionalInput: boolean = false;

//   constructor(
//     public dialogRef: MatDialogRef<AddPersonDetailsDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: Associate
//   ) { }

//   ngOnInit(): void {
//     this.personForm = new FormGroup({
//       // id: new FormControl('', Validators.required),
//       associateName: new FormControl('', Validators.required),
//       associateId: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
//       associateEmail: new FormControl('', [Validators.required, Validators.email]),
//       role: new FormControl<RoleValue | null>(null, Validators.required),
//       // Add the new optional field. Initialize as null or empty string.
//       // No initial validators as it's optional by default.
//       description: new FormControl(null), // This will hold the additional input
//     });

//     // If data is provided, it means we are in edit mode, so patch the form values
//     if (this.data) {
//       this.personForm.patchValue(this.data);
//       this.personForm.get('associateId')?.disable();
//       this.personForm.get('id')?.disable();
//     }

//     // Subscribe to role changes to manage additional input visibility and validation
//     this.personForm.get('role')?.valueChanges.subscribe(role => {
//       const descriptionControl = this.personForm.get('description');
//       if (role === ROLES.TECHNICAL_TRAINER) {
//         this.showAdditionalInput = true;
//         // If it's a technical trainer, make the additional input required
//         descriptionControl?.setValidators(Validators.required);
//       } else {
//         this.showAdditionalInput = false;
//         // Clear value and validators if not a technical trainer
//         descriptionControl?.clearValidators();
//         descriptionControl?.setValue(null); // Clear value when hidden
//       }
//       descriptionControl?.updateValueAndValidity(); // Recalculate validation status
//     });

//     // Manually trigger valueChanges for initial setup if in edit mode and role is already set
//     if (this.data && this.data.role) {
//       this.personForm.get('role')?.updateValueAndValidity();
//     }
//   }

//   onSave(): void {
//     if (this.personForm.valid) {
//       if (this.personForm.get('associateId')?.disabled) {
//         this.personForm.get('associateId')?.enable();
//       }

//       // Ensure the 'description' field is included in the result DTO
//       const result: Associate = {
//         ...this.personForm.value,
//         description: this.personForm.get('description')?.value // Include the new field
//       };

//       this.dialogRef.close(result);
//     } else {
//       this.personForm.markAllAsTouched();
//     }
//   }

//   onCancel(): void {
//     this.dialogRef.close();
//   }
// }

// src/app/add-person-details-dialog/add-person-details-dialog.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Imports for the dialog's UI
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { ROLES, RoleValue } from 'src/app/shared/constants/roles';
import { Associate } from 'src/app/models/Person.model';

export const ROLES_FOR_BACKEND = {
  SKILLING_LEAD: 'SKILLING_LEAD',
  ACADEMY_COORDINATOR: 'ACADEMY_COORDINATOR',
  TECHNICAL_TRAINER: 'TECHNICAL_TRAINER',
  COACH: 'COACH',
  BH_TRAINER: 'BH_TRAINER',
  MENTOR: 'MENTOR',
  CR: 'CR',
  ADMIN: 'ADMIN',
};

@Component({
  selector: 'dialog-add-person-details-dialog',
  templateUrl: './add-person-details-dialog.component.html',
  styleUrls: ['./add-person-details-dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    CommonModule,
  ],
})
export class AddPersonDetailsDialogComponent implements OnInit {
  personForm!: FormGroup;

  

  rolesList = Object.values(ROLES_FOR_BACKEND);

  // roleList = {
  //   "TECHNICAL_TRAINER"
  // }


  showAdditionalInput: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddPersonDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Associate // data will contain the 'id'
  ) { }

  ngOnInit(): void {
    this.personForm = new FormGroup({
      // Do NOT add 'id' as a FormControl here if it's not meant to be edited by the user.
      // We will merge it back into the result manually.
      associateName: new FormControl('', Validators.required),
      associateId: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      associateEmail: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl<RoleValue | null>(null, Validators.required),
      description: new FormControl(null),
    });

    // If data is provided, it means we are in edit mode, so patch the form values
    if (this.data) {
      // Patch only the form controls that exist in the form
      this.personForm.patchValue({
        associateName: this.data.associateName,
        associateId: this.data.associateId,
        associateEmail: this.data.associateEmail,
        role: this.data.role,
        description: this.data.description // Make sure to patch description if it exists
      });

      this.personForm.get('associateId')?.disable();
      // If you are absolutely sure 'id' shouldn't be edited and exists in data
      // you could add a dummy form control and disable it, but it's simpler to pass it directly.
      // This line `this.personForm.get('id')?.disable();` was problematic because 'id' wasn't a control.
    }

    this.personForm.get('role')?.valueChanges.subscribe(role => {
      const descriptionControl = this.personForm.get('description');
      if (role === ROLES_FOR_BACKEND.TECHNICAL_TRAINER) { // Ensure ROLES.TECHNICAL_TRAINER matches constant name
        this.showAdditionalInput = true;
        descriptionControl?.setValidators(Validators.required);
      } else {
        this.showAdditionalInput = false;
        descriptionControl?.clearValidators();
        descriptionControl?.setValue(null);
      }
      descriptionControl?.updateValueAndValidity();
    });

    if (this.data && this.data.role) {
      this.personForm.get('role')?.updateValueAndValidity();
    }
  }

  onSave(): void {
    if (this.personForm.valid) {
      if (this.personForm.get('associateId')?.disabled) {
        this.personForm.get('associateId')?.enable();
      }

      // Create the result object.
      // Start with the current form values.
      const result: Associate = {
        ...this.personForm.value,
        // Crucially, if in edit mode (this.data exists), add the original 'id' back.
        // If it's a new user, 'id' will be undefined, which is fine for creation.
        id: this.data ? this.data.id : '', // Assign original 'id' if data exists, otherwise leave empty or null
        description: this.personForm.get('description')?.value // Include the new field
      };

      this.dialogRef.close(result);
    } else {
      this.personForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}