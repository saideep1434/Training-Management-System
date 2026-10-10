import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CohortModel, CohortService, CohortStaffUpdateDto } from 'src/app/services/cohort.service';

@Component({
  selector: 'app-edit-cohort-staff-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Edit Cohort Staff</h2>
    <div mat-dialog-content>
      <form>
        <mat-form-field appearance="outline" class="w-100 m-b-10">
          <mat-label>Technical Trainer</mat-label>
          <mat-select [(ngModel)]="payload.techTrainerAssociateId" name="tt">
            <mat-option [value]="null">— Keep unchanged —</mat-option>
            <mat-option *ngFor="let t of techTrainers" [value]="t.value">{{ t.label }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-100 m-b-10">
          <mat-label>Coach</mat-label>
          <mat-select [(ngModel)]="payload.coachAssociateId" name="coach">
            <mat-option [value]="null">— Keep unchanged —</mat-option>
            <mat-option *ngFor="let c of coaches" [value]="c.value">{{ c.label }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-100 m-b-10">
          <mat-label>Mentor</mat-label>
          <mat-select [(ngModel)]="payload.mentorAssociateId" name="mentor">
            <mat-option [value]="null">— Keep unchanged —</mat-option>
            <mat-option *ngFor="let m of mentors" [value]="m.value">{{ m.label }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-100 m-b-10">
          <mat-label>BH Trainer</mat-label>
          <mat-select [(ngModel)]="payload.bhTrainerAssociateId" name="bh">
            <mat-option [value]="null">— Keep unchanged —</mat-option>
            <mat-option *ngFor="let b of bhTrainers" [value]="b.value">{{ b.label }}</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-flat-button color="primary" (click)="save()">Save</button>
    </div>
  `
})
export class EditCohortStaffDialogComponent {
  payload: CohortStaffUpdateDto = {};
  techTrainers: { label: string; value: string }[] = [];
  coaches: { label: string; value: string }[] = [];
  mentors: { label: string; value: string }[] = [];
  bhTrainers: { label: string; value: string }[] = [];

  constructor(
    private ref: MatDialogRef<EditCohortStaffDialogComponent>,
    private cohortService: CohortService,
    @Inject(MAT_DIALOG_DATA) public data: { cohort: CohortModel }
  ) {
    this.initOptions();
  }

  private initOptions(): void {
    this.cohortService.fetchTechnicalTrainers().subscribe(opts => this.techTrainers = opts);
    this.cohortService.fetchCoaches().subscribe(opts => this.coaches = opts);
    this.cohortService.fetchMentors().subscribe(opts => this.mentors = opts);
    this.cohortService.fetchBHTrainers().subscribe(opts => this.bhTrainers = opts);
  }

  close(): void { this.ref.close(); }

  save(): void {
    // Return only fields explicitly chosen; nulls keep unchanged on server
    this.ref.close(this.payload);
  }
}
