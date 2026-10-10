// src/app/components/add-learning-path-dialog/add-learning-path-dialog.component.ts
 
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

// import { LearningPath } from 'src/app/models/class/learning-path.model'; // No longer directly needed for instantiation here
 
// Angular Material Modules for the template
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
// If using actual date pickers, uncomment these:
import { MatDatepickerModule } from '@angular/material/datepicker'; // Added for date pickers
import { MatNativeDateModule } from '@angular/material/core'; // Added for date pickers
import { LearningPathService } from 'src/app/services/LearningPath.service';
import { LearningPath } from 'src/app/models/learningPath.model';
import { DayDetail } from 'src/app/models/class/day-detail.model';
import { ServiceLineService } from 'src/app/services/serviceLine.service';
import { ServiceLine } from 'src/app/models/serviceLine.model';
import { MatSelectModule } from '@angular/material/select'; // For mat-select
import { MatOptionModule } from '@angular/material/core'; 
 
@Component({
  selector: 'app-add-learning-path-dialog',
  templateUrl: './add-learning-path-dialog.component.html',
  styleUrls: ['./add-learning-path-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule, // Uncommented
    MatNativeDateModule,
    MatSelectModule,     // Add this
    MatOptionModule, // Uncommented,
  ]
})
export class AddLearningPathDialogComponent implements OnInit {
  addForm!: FormGroup;
  isEditMode: boolean = false;
 
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddLearningPathDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LearningPath | null,
    private learningPathService: LearningPathService,
    private serviceLineService: ServiceLineService
  ) {
  }

  serviceLineOptions : ServiceLine[];
 
  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.initForm();
 
    if (this.isEditMode && this.data) {
      this.populateForm(this.data);
    }
 
    this.addForm.get('totalDurationWeeks')?.valueChanges.subscribe(weeks => {
        this.generateDayDetails(weeks);
    });


  }

  loadServiceLineOptions() : void {
    this.serviceLineService.fetchAllServiceLines("all").subscribe ({
        next: (data: ServiceLine[]) => {
          this.serviceLineOptions = data;
          console.log("Service Lines options fetched successfuly", this.serviceLineOptions);
        },
        error: (error: any) => {
          console.log("Error fetching service lines in component", error);
        },
        complete: () => {
          console.log("Service Lines fetched successfully");
        }
      })
  }
 
  private initForm(): void {
    this.addForm = this.fb.group({
      serviceLineName: ['', Validators.required],
      totalDurationWeeks: [null, [Validators.required, Validators.min(1)]],
      // qualifierDate: ['', Validators.required],
      qualifierDay: [null, [Validators.required, Validators.min(1)]],
      // interimDate: ['', Validators.required],
      interimDay: [null, [Validators.required, Validators.min(1)]],
      // finalDate: ['', Validators.required],
      finalDay: [null, [Validators.required, Validators.min(1)]],
      dayDetails: this.fb.array([])
    });
    this.loadServiceLineOptions();
  }
 
  private populateForm(data: LearningPath): void {
    this.addForm.patchValue({
      serviceLineName: data.serviceLineName,
      totalDurationWeeks: data.totalDurationWeeks,

      // Convert Date objects to ISO string for type="date" inputs or MatDatepicker compatibility
      // Assuming data.qualifierDate etc. are Date objects from the LearningPath class instance
      // qualifierDate: this.formatDateForInput(data.qualifierDate),
      // qualifierDay: data.qualifierDay,
      // interimDate: this.formatDateForInput(data.interimDate),
      // interimDay: data.interimDay,
      // finalDate: this.formatDateForInput(data.finalDate),
      // finalDay: data.finalDay,
    });
 
    // Clear existing day details and add new ones from data
    this.dayDetails.clear();
    // data.dayDetails.forEach(day => this.addDayDetail(day));
  }
 
  // Helper to format Date objects or strings into 'YYYY-MM-DD' for input fields
  // This was already present in your original component, just ensuring it's used here.
  private formatDateForInput(dateInput: Date | string | undefined): string {
    if (!dateInput) return '';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '';
 
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
 
 
  get dayDetails(): FormArray {
    return this.addForm.get('dayDetails') as FormArray;
  }
 
  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }
 
  addDayDetail(day?: DayDetail): void {
    const dayGroup = this.fb.group({
      dayNumber: [day ? day.dayNumber : null, [Validators.required, Validators.min(1)]],
      topic: [day ? day.topic : '', Validators.required],
      description: [day ? day.description : '', Validators.required]
    });
    this.dayDetails.push(dayGroup);
  }
 
  removeDayDetail(index: number): void {
    this.dayDetails.removeAt(index);
  }
 
  private generateDayDetails(weeks: number | null): void {
    this.dayDetails.clear();
    if (weeks && weeks > 0) {
      const totalDays = weeks * 5;
      for (let i = 1; i <= totalDays; i++) {
        this.addDayDetail({ dayNumber: i, topic: '', description: '' });
      }
    }
  }
 
  onSave(): void {
    if (this.addForm.valid) {
      const formValue = this.addForm.value;
 
      // Type the data being sent to the service as LearningPathInterface
      // The service is responsible for instantiating the LearningPath class from this data.
      const learningPathData: LearningPath = {
        serviceLineName: formValue.serviceLineName,
        totalDurationWeeks: formValue.totalDurationWeeks,
        dayDetails: formValue.dayDetails,
      };

      console.log(learningPathData);
      this.dialogRef.close(learningPathData);
    } else {
      this.addForm.markAllAsTouched();
      console.error('Form is invalid. Please check all fields.');
    }
  }
 
  onCancel(): void {
    this.dialogRef.close(false);
  }
}