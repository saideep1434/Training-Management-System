
// import { Component, OnInit, OnDestroy } from '@angular/core'; // Add OnDestroy for cleanup
// import { CommonModule, DatePipe } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { MatListModule } from '@angular/material/list';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { FormsModule } from '@angular/forms';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { Subject, Subscription } from 'rxjs'; // Import Subscription
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { RouterLink, Router } from '@angular/router';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatDialog } from '@angular/material/dialog';
// @Component({
//   selector: 'app-cohort-card',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatListModule,
//     MatCardModule,
//     DatePipe,
//     MatIconModule,
//     MatButtonModule,
//     MatChipsModule,
//     MatDividerModule,
//     MatFormFieldModule,
//     MatInputModule,
//     FormsModule,
//     MatTooltipModule,
//     RouterLink,
//     MatMenuModule,
//   ],
//   templateUrl: './cohort-card.component.html',
//   styleUrl: './cohort-card.component.scss'
// })
// export class CohortCardComponent {

// }

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { StorageService } from '../../services/storage.service';

// Assuming you have a Cohort model
import { Cohort } from '../../models/class/cohort.model'; // Adjust path as needed

@Component({
  selector: 'app-cohort-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule // Make sure to import MatDividerModule
  ],
  templateUrl: './cohort-card.component.html',
  styleUrls: ['./cohort-card.component.scss']
})
export class CohortCardComponent implements OnInit {
  @Input() cohort!: Cohort; // Input to receive the cohort data

  // Outputs for actions
  @Output() viewDetailsClicked = new EventEmitter<string>();
  @Output() editClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();

  isReadOnly = false;
  canManageCohorts = false;

  constructor() { }

  ngOnInit(): void {
    this.isReadOnly = StorageService.isReadOnly();
    this.canManageCohorts = StorageService.canManageCohorts();
  }

  viewDetails(cohortId: string): void {
    this.viewDetailsClicked.emit(cohortId);
  }

  editCohort(cohortId: string): void {
    this.editClicked.emit(cohortId);
  }

  deleteCohort(cohortId: string): void {
    this.deleteClicked.emit(cohortId);
  }
}
