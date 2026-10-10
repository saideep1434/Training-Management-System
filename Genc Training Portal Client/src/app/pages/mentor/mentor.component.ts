import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CohortService } from 'src/app/services/cohort.service';
import { Cohort } from 'src/app/models/class/cohort.model';
import { StorageService } from 'src/app/services/storage.service';
import { AssociateForRequest } from 'src/app/models/Person.model';

@Component({
  selector: 'app-mentor',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './mentor.component.html',
  styleUrls: ['./mentor.component.scss']
})
export class MentorComponent implements OnInit, OnDestroy {
  loading = true;
  cohorts: Cohort[] = [];
  subs = new Subscription();
  // KPIs
  totalAssigned = 0;
  activeNow = 0;
  uniqueLocationsCount = 0;

  constructor(private cohortService: CohortService) {}

  ngOnInit(): void {
    const rawRole = StorageService.getUserPrimaryRole();
    let cleanedRole = rawRole;
    if (rawRole && rawRole.startsWith('ROLE_')) {
      cleanedRole = rawRole.substring('ROLE_'.length);
    }
    const associateRequest: AssociateForRequest = {
      associateEmail: StorageService.getUserId(),
      role: cleanedRole || null,
    };

    const sub = this.cohortService
      .fetchAllCohortsDetailsByRole('role-specific', associateRequest)
      .subscribe({
        next: (cohorts) => {
          this.cohorts = cohorts || [];
          this.computeKpis();
          this.loading = false;
        },
        error: () => {
          this.cohorts = [];
          this.computeKpis();
          this.loading = false;
        },
      });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private computeKpis(): void {
    this.totalAssigned = this.cohorts.length;
    const today = new Date();
    this.activeNow = this.cohorts.filter(c => {
      const start = c.trainingStartDate ? new Date(c.trainingStartDate) : null;
      const end = c.trainingEndDate ? new Date(c.trainingEndDate) : null;
      return !!start && !!end && start <= today && today <= end;
    }).length;
    const unique = new Set(this.cohorts.map(c => c.location).filter(Boolean));
    this.uniqueLocationsCount = unique.size;
  }
}
