import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { LearningPathOption } from 'src/app/models/learningPath.model';
import { LearningPathService } from 'src/app/services/LearningPath.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AuthService } from 'src/app/services/auth.service';
import { ROLES } from 'src/app/shared/constants/roles';

@Component({
  selector: 'app-learning-path-details',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    TablerIconsModule,
    ReactiveFormsModule
  ],
  templateUrl: './learning-path-details.component.html',
  styleUrls: ['./learning-path-details.component.scss']
})
export class LearningPathDetailsComponent implements OnInit, OnDestroy {
  learningPath: LearningPathOption | null = null;
  learningPathId: number | null = null;
  isLoading = true;

  curriculumForm!: FormGroup;
  canManageLearningPath = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private learningPathService: LearningPathService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Determine if the current user has permission to edit (Coach/Admin)
    this.canManageLearningPath = this.authService.hasAnyRole([
      ROLES.COACH,
      ROLES.ADMIN,
      ROLES.ACADEMY_COORDINATOR,
    ]);
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.learningPathId = id ? +id : null;

        if (this.learningPathId) {
          this.fetchLearningPathDetails(this.learningPathId);
          return of(null);
        } else {
          console.warn('Learning Path ID not found. Redirecting.');
          this.router.navigate(['../'], { relativeTo: this.route });
          return of(null);
        }
      })
    ).subscribe();
  }

  private fetchLearningPathDetails(id: number): void {
    this.isLoading = true;
    this.learningPathService.getLearningPathById(id).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe({
      next: (path: LearningPathOption) => {
        this.learningPath = path;
        if (this.learningPath.dayDetails) {
          this.learningPath.dayDetails.sort((a, b) => a.dayNumber - b.dayNumber);
        }
        this.initializeForm();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching details:', err);
        this.isLoading = false;
        this.snackBar.open('Error loading learning path details.', 'Close', { duration: 3000 });
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    });
  }

  private initializeForm(): void {
    this.curriculumForm = this.fb.group({
      dayDetails: this.fb.array(
        this.learningPath?.dayDetails.map(day => this.createDayGroup(day)) || []
      )
    });
  }

  createDayGroup(day: any): FormGroup {
    return this.fb.group({
      dayNumber: [day.dayNumber, Validators.required],
      topic: [day.topic, Validators.required],
      description: [day.description, Validators.required]
    });
  }

  get dayDetails(): FormArray {
    return this.curriculumForm.get('dayDetails') as FormArray;
  }

  addNewDay(): void {
    if (!this.canManageLearningPath) {
      this.snackBar.open("You don't have permission to modify the curriculum.", 'Close', { duration: 3000 });
      return;
    }
    const nextDayNumber = this.dayDetails.length + 1;
    this.dayDetails.push(this.fb.group({
      dayNumber: [nextDayNumber, Validators.required],
      topic: ['', Validators.required],
      description: ['', Validators.required]
    }));
  }

  removeDay(index: number): void {
    if (!this.canManageLearningPath) {
      this.snackBar.open("You don't have permission to modify the curriculum.", 'Close', { duration: 3000 });
      return;
    }
    this.dayDetails.removeAt(index);
  }

  saveCurriculum(): void {
    if (!this.canManageLearningPath) {
      this.snackBar.open("You don't have permission to save changes.", 'Close', { duration: 3000 });
      return;
    }
    if (this.curriculumForm.invalid) {
      this.snackBar.open('Please fill all required fields.', 'Close', { duration: 3000 });
      return;
    }

    if (!this.learningPath) {
      return;
    }

    const updatedLearningPath: LearningPathOption = {
      ...this.learningPath,
      dayDetails: this.curriculumForm.value.dayDetails
    };

    this.learningPathService.updateLearningPath(updatedLearningPath).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe({
      next: () => {
        this.snackBar.open('Curriculum updated successfully!', 'Close', { duration: 3000 });
      },
      error: (err: any) => {
        console.error('Error updating curriculum:', err);
        this.snackBar.open('Error updating curriculum. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
