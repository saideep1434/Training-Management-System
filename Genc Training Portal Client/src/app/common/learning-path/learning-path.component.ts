import { Component, Output, EventEmitter, OnInit } from '@angular/core'; // Import OnInit
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatIconModule } from '@angular/material/icon';
// import { AppCourseDetailComponent } from '../course-detail/course-detail.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
// import { AppCourseDetailComponent } from 'src/app/pages/ui-components/courseSection/course-detail.component'; // Commented out as per original
import { MatDialog } from '@angular/material/dialog';
import { AddLearningPathDialogComponent } from 'src/app/components/add-learning-path-dialog/add-learning-path-dialog.component';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { LearningPath, LearningPathOption } from 'src/app/models/learningPath.model';
import { LearningPathService } from 'src/app/services/LearningPath.service';
// Import the LearningPath model (assuming this is defined elsewhere)
// IMPORTANT: Ensure this path is correct. If your LearningPath interface is in 'models/interfaces', use that.
// Based on previous steps, it should be: 'src/app/models/interfaces/learning-path.model'
// import { LearningPathInterface } from 'src/app/models/interfaces/learning-path';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ROLES } from 'src/app/shared/constants/roles';
import { StorageService } from 'src/app/services/storage.service';
interface ProductCard {
  id: number;
  iconName: string;
  count: number;
  title: string;
}

@Component({
  selector: 'app-learning-path-card',
  standalone: true,
  imports: [
    MatCardModule,
    TablerIconsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    DatePipe,
    RouterModule,
    CommonModule
  ],
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.scss']
})
export class AppLearningPathComponent implements OnInit { // Implement OnInit


  learningPaths$: Observable<LearningPathOption[]>;
  private unsubscribe$ = new Subject<void>();
  canManageLearningPath = false; // Coach/Admin permission flag
  isReadOnly = false; // Guest/read-only mode flag

  // Data for the cards - initialize with default, but it will be overwritten by localStorage
  productcards: ProductCard[] = [
  ];

  constructor(private dialog: MatDialog, private learningPathService: LearningPathService,
    private router: Router,       // <--- Inject Router
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  statusMessage: string | null = null;
  isStatusError: boolean = false;
  private statusTimer: any; // Holds the reference to our setTimeout timer

  createdPath: LearningPath | null = null;


  ngOnInit(): void {
    // Load data from localStorage when the component initializes
    // this.loadLearningPaths();
    // console.log(this.productcards)

    this.isReadOnly = StorageService.isReadOnly();
    this.learningPaths$ = this.learningPathService.getLearningPaths("basic-info");

    // Compute permission (only Coach or Admin can add/edit)
    this.canManageLearningPath = this.authService.hasAnyRole([
      ROLES.COACH,
      ROLES.ADMIN,
      ROLES.ACADEMY_COORDINATOR,
    ]);

  }

  @Output() cardClicked = new EventEmitter<number>();

  onCardClick(cardId: number) {
    this.cardClicked.emit(cardId);
  }

  onMenuItemClick(action: string, cardId: number) {
    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete card "${this.productcards.find(c => c.id === cardId)?.title}"?`)) {
          this.productcards = this.productcards.filter(card => card.id !== cardId);
          // this.saveLearningPaths(); // Save after deletion
        }
        break;
      case 'rename':
        // For renaming, you would typically open a dialog similar to AddLearningPathDialogComponent
        // to get the new name, then update the array and save.
        alert(`Rename functionality for card ${cardId} is not yet implemented.`);
        break;
      case 'modify':
        alert(`Modify functionality for card ${cardId} is not yet implemented.`);
        break;
    }
  }

  openAddLearningPathDialog(): void {
      if (this.isReadOnly) {
        this.snackBar.open('Cannot create learning path. Guest users have read-only access.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        return;
      }
      if (!this.canManageLearningPath) {
        this.snackBar.open("You don't have permission to add a learning path.", 'Close', { duration: 3000 });
        return;
      }
      const dialogRef = this.dialog.open(AddLearningPathDialogComponent, {
        width: '800px',
        disableClose: true
      });
      dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
        if (result) {
          const newLearningPathData: LearningPath = result;
          this.learningPathService.addLearningPath("add", newLearningPathData).subscribe({
            next: (path: LearningPath) => {
              this.isStatusError = false;
              this.statusMessage = `Learning path for service line ${path.serviceLineName} with duration of ${path.totalDurationWeeks} is added successfully`;
              this.displayStatus(this.statusMessage, this.isStatusError, 3000);
            },
            error: (err: any) => {
              this.isStatusError = true;
              this.statusMessage = "Error adding the learning path";
              this.displayStatus(this.statusMessage, this.isStatusError, 3000);
            }
          })
        }
      })
    }

    editLearningPath(id:number | undefined): void {
        if (this.isReadOnly) {
          this.snackBar.open('Cannot edit learning path. Guest users have read-only access.', 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          return;
        }
        if (!this.canManageLearningPath) {
          this.snackBar.open("You don't have permission to edit a learning path.", 'Close', { duration: 3000 });
          return;
        }
        const dialogRef = this.dialog.open(AddLearningPathDialogComponent, {
          width: '800px',
          data: id,
          disableClose: true
        });

        dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
            if (result) {
                this.snackBar.open('Learning Path updated successfully', 'Close', { duration: 3000 });
            }
        });
    }

    viewLearningPathDetails(id: number | undefined): void {
      if (id !== undefined) {
        // Assuming your route for learning path details is something like:
        // /academic-coordinator/learning-paths/details/:id
        // OR /academic-coordinator/learning-path-details/:id
        //
        // If 'learning-paths' is the current base, you can use relative navigation:
        this.router.navigate(['details', id], {relativeTo: this.route} );
        // Example if 'details' is directly under the current 'learning-paths' route
        // e.g., if current is /academic-coordinator/learning-paths, it becomes /academic-coordinator/learning-paths/details/ID

        // If the path is /academic-coordinator/learning-path-details/:id (a sibling route to learning-paths)
        // this.router.navigate(['../learning-path-details', id], { relativeTo: this.route });

        // If you need to navigate from the root (e.g., from a dashboard)
        // this.router.navigate(['/academic-coordinator/learning-path-details', id]);
      }
    }


    // >>> ADD THIS DELETE METHOD <<<
    deleteLearningPath(id: number | undefined): void {
      if (this.isReadOnly) {
        this.snackBar.open('Cannot delete learning path. Guest users have read-only access.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        return;
      }
      if (id !== undefined) {
        if (confirm('Are you sure you want to delete this learning path?')) {
          // this.learningPathService.deleteLearningPath(id); // Call the service method
        }
      }
    }

    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

    private displayStatus(message: string, isError: boolean, duration: number = 3000): void {
      this.clearStatusTimer(); // Clear any existing timer first

      this.statusMessage = message;
      this.isStatusError = isError;

      // Set a new timer to clear the message after 'duration' milliseconds
      this.statusTimer = setTimeout(() => {
        this.clearStatusMessage();
      }, duration);
    }

    /**
     * Clears the status message and its associated timer.
     */
    private clearStatusMessage(): void {
      this.statusMessage = null;
      this.isStatusError = false;
      this.clearStatusTimer(); // Ensure the timer itself is cleared
    }

    /**
     * Helper to clear the setTimeout timer.
     */
    private clearStatusTimer(): void {
      if (this.statusTimer) {
        clearTimeout(this.statusTimer);
        this.statusTimer = null;
      }
    }

}

