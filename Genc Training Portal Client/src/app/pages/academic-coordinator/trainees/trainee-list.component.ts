import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { TraineeService, TraineeDto } from 'src/app/services/trainee.service';
import { CohortService } from 'src/app/services/cohort.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trainee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatSnackBarModule],
  templateUrl: './trainee-list.component.html',
  styles: [`
    .filters { align-items: center; }
    table { width: 100%; }
  `]
})
export class TraineeListComponent implements OnInit {
  trainees: TraineeDto[] = [];
  displayedColumns = ['select', 'name', 'email', 'domain', 'skills'];
  selected = new Set<number>();
  allSelected = false;

  domain = '';
  skills = '';
  unassignedOnly = true;

  targetCohortId: number | null = null;
  cohortOptions: { label: string; value: number }[] = [];

  constructor(private traineeService: TraineeService, private cohortService: CohortService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.applyFilters();
    this.loadCohorts();
  }

  applyFilters(): void {
    this.traineeService.filterTrainees({ domain: this.domain || undefined, skills: this.skills || undefined, unassignedOnly: this.unassignedOnly })
      .subscribe(list => { this.trainees = list; this.selected.clear(); this.allSelected = false; });
  }

  loadCohorts(): void {
    this.cohortService.fetchAllCohortsDetails('all-cohorts').subscribe({
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
    if (!this.targetCohortId) return;
    const ids = Array.from(this.selected);
    this.traineeService.assignTraineesToCohort(ids, this.targetCohortId).subscribe({
      next: () => {
        this.snack.open(`Assigned ${ids.length} trainee(s)`, 'OK', { duration: 2500 });
        this.applyFilters();
      },
      error: () => this.snack.open('Assignment failed', 'Dismiss', { duration: 3000 })
    });
  }
}
