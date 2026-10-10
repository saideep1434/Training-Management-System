import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trainer-connect-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './trainer-connect-dialog.component.html',
  styleUrls: ['./trainer-connect-dialog.component.scss']
})
export class TrainerConnectDialogComponent implements OnInit {
  
  connectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TrainerConnectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cohortId: string, trainerId: number }
  ) {}

  ngOnInit(): void {
    this.connectForm = this.fb.group({
      date: [new Date(), Validators.required],
      contributionHrs: [0, [Validators.required, Validators.min(1)]],
      topics: ['', Validators.required],
      modeOfTraining: ['', Validators.required],
      acknowledgement: [false]
    });
  }

  onSave() {
    if(this.connectForm.valid) {
      const result = {
        cohortId: this.data.cohortId,
        trainerId: this.data.trainerId,
        ...this.connectForm.value
      };
      this.dialogRef.close(result);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
