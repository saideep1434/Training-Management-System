import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TraineeService, TraineeDto } from 'src/app/services/trainee.service';
import { CohortService } from 'src/app/services/cohort.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-trainee-list-common',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatSnackBarModule, MatIconModule],
  templateUrl: './trainee-list.component.html'
})
export class TraineeListCommonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() enableAssign = true;

  trainees: TraineeDto[] = [];
  displayedColumns = ['name', 'email', 'domain', 'skills'];
  selected = new Set<number>();
  allSelected = false;
  isReadOnly = false;

  domain = '';
  skills = '';
  unassignedOnly = true;

  targetCohortId: number | null = null;
  cohortOptions: { label: string; value: number }[] = [];

  constructor(
    private traineeService: TraineeService,
    private cohortService: CohortService,
    private snack: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isReadOnly = StorageService.isReadOnly();
    if (this.enableAssign && !this.isReadOnly) {
      this.displayedColumns = ['select', ...this.displayedColumns];
      this.loadCohorts();
    }
    this.applyFilters();
  }

  applyFilters(): void {
    this.traineeService.filterTrainees({ domain: this.domain || undefined, skills: this.skills || undefined, unassignedOnly: this.unassignedOnly })
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => { this.trainees = list; this.selected.clear(); this.allSelected = false; });
  }

  loadCohorts(): void {
    this.cohortService.fetchAllCohortsDetails('all-cohorts')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cohorts) => {
          this.cohortOptions = cohorts.map(c => ({ label: `${c.cohortCode} • ${c.domainName || ''}`.trim(), value: Number((c as any).cohortId) }))
            .filter(c => !!c.value) as { label: string; value: number }[];
        },
        error: () => {
          this.snack.open('Failed to load cohorts', 'Dismiss', { duration: 3000 });
        }
      });
  }

  toggle(t: TraineeDto): void {
    if (this.selected.has(t.traineeId)) this.selected.delete(t.traineeId); else this.selected.add(t.traineeId);
    this.allSelected = this.selected.size === this.trainees.length && this.trainees.length > 0;
  }

  toggleAll(ev: Event): void {
    const checked = (ev.target as HTMLInputElement).checked;
    this.selected.clear();
    if (checked) this.trainees.forEach(t => this.selected.add(t.traineeId));
    this.allSelected = checked;
  }

  assignSelected(): void {
    if (this.isReadOnly) {
      this.snack.open('Cannot assign trainees. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    if (!this.targetCohortId) return;
    const ids = Array.from(this.selected);
    this.traineeService.assignTraineesToCohort(ids, this.targetCohortId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snack.open(`Assigned ${ids.length} trainee(s)`, 'OK', { duration: 2500 });
          this.applyFilters();
        },
        error: () => this.snack.open('Assignment failed', 'Dismiss', { duration: 3000 })
      });
  }

  goToUpload(): void {
    if (this.isReadOnly) {
      this.snack.open('Cannot upload trainees. Guest users have read-only access.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    // Navigate to sibling 'upload' route relative to current 'list'
    this.router.navigate(['../upload'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
