import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Cohort } from '../../models/class/cohort.model';
import { CohortService } from '../../services/cohort.service';
import { CohortCardComponent } from 'src/app/components/cohort-card/cohort-card.component';
import { AddCohortDialogComponent } from 'src/app/components/add-cohort-dialog-component/add-cohort-dialog-component.component';
import { StorageService } from 'src/app/services/storage.service';
import { AssociateForRequest } from 'src/app/models/Person.model';

@Component({
  selector: 'app-cohort',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatSnackBarModule,
    RouterLink,
    CohortCardComponent
  ],
  templateUrl: './cohort.component.html'
})
export class AppCohortComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private cohortService: CohortService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  allCohorts: Cohort[] = [];
  filteredCohorts: Cohort[] = [];
  searchTerm: string = '';
  isReadOnly = false;
  canManageCohorts = false;
  private searchInput$ = new Subject<string>();
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.isReadOnly = StorageService.isReadOnly();
    this.canManageCohorts = StorageService.canManageCohorts();
    this.fetchAllCohortsDetailsByRole();

    this.subscriptions.add(this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.searchTerm = term;
      this.applyFilters();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSearchInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchInput$.next(inputElement.value.trim());
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  applyFilters(): void {
    if (!this.searchTerm) {
      this.filteredCohorts = [...this.allCohorts];
      return;
    }

    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();

    this.filteredCohorts = this.allCohorts.filter(cohort =>
      (cohort.cohortId || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cohort.cohortCode || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cohort.domainName || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cohort.technicalTrainerName || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cohort.coachName || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cohort.mentorName || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cohort.bhTrainerName || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cohort.location || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cohort.hireType || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cohort.vertical || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (cohort.serviceLine || '').toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  fetchAllCohortsDetailsByRole(): void {
    const rawRole = StorageService.getUserPrimaryRole();
    let cleanedRole = rawRole;

    if (rawRole && rawRole.startsWith('ROLE_')) {
      cleanedRole = rawRole.substring('ROLE_'.length);
    }

    const associateRequest: AssociateForRequest = {
      associateEmail: StorageService.getUserId(),
      role: cleanedRole
    };

    this.cohortService.fetchAllCohortsDetailsByRole("role-specific", associateRequest).subscribe({
      next: (cohorts: Cohort[]) => {
        this.allCohorts = cohorts;
        this.applyFilters();
      },
      error: (err: any) => {
        this.snackBar.open('Failed to load cohorts. Please try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  addCohort(): void {
    if (this.isReadOnly) {
      this.showReadOnlyMessage('Cannot create cohort');
      return;
    }

    if (!this.canManageCohorts) {
      this.snackBar.open('You do not have permission to create cohorts. Only Admin and Academy Coordinator can manage cohorts.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    const dialogRef = this.dialog.open(AddCohortDialogComponent, {
      width: '500px',
      disableClose: true
    });

    this.subscriptions.add(dialogRef.afterClosed().subscribe((newCohortData: Cohort | undefined) => {
      if (newCohortData) {
        this.cohortService.addCohort("add", newCohortData).subscribe({
          next: (response) => {
            this.snackBar.open('Cohort created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.fetchAllCohortsDetailsByRole();
          },
          error: (err) => {
            this.snackBar.open('Failed to create cohort. Please try again.', 'Close', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        });
      }
    }));
  }

  viewDetails(id: string): void {
    this.router.navigate(['cohort', id], { relativeTo: this.route });
  }

  editCohort(cohortId: string): void {
    if (this.isReadOnly) {
      this.showReadOnlyMessage('Cannot edit cohort');
      return;
    }

    if (!this.canManageCohorts) {
      this.snackBar.open('You do not have permission to edit cohorts. Only Admin and Academy Coordinator can manage cohorts.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    // TODO: Implement edit dialog and API call
  }

  deleteCohort(cohortId: string): void {
    if (this.isReadOnly) {
      this.showReadOnlyMessage('Cannot delete cohort');
      return;
    }

    if (!this.canManageCohorts) {
      this.snackBar.open('You do not have permission to delete cohorts. Only Admin and Academy Coordinator can manage cohorts.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    // TODO: Implement delete confirmation and API call
  }

  private showReadOnlyMessage(action: string): void {
    this.snackBar.open(
      `${action}. Guest users have read-only access.`,
      'Close',
      {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['warn-snackbar']
      }
    );
  }
}
