import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { TechnicalTrainerService } from 'src/app/services/trainer.service';
import { BHTrainerService } from 'src/app/services/bhtrainer.service';
import { CoachService } from 'src/app/services/coach.service';
import { MentorService } from 'src/app/services/mentor.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CohortService } from 'src/app/services/cohort.service';
import { TraineeService } from 'src/app/services/trainee.service';

interface productCards {
  // id: number;
  // //imgSrc: string;
  // title: string;
  // price: string;
  // rprice: string;

  id: number;
  icon: string; // Icon class
  title: string;
  total: number | null; // null => unknown
  available: number | null; // null => unknown
}

@Component({
  selector: 'app-dash-cards',
  standalone: true,
  imports: [MatCardModule, TablerIconsModule, MatButtonModule,MatIconModule,MatDividerModule,MatGridListModule,CommonModule],
  templateUrl: './dash-cards.component.html',
  styleUrls: ['./dash-cards.component.scss']

})
export class DashCardsComponent implements OnInit {

  constructor(
    private techService: TechnicalTrainerService,
    private bhService: BHTrainerService,
    private coachService: CoachService,
    private mentorService: MentorService,
    private cohortService: CohortService,
    private traineeService: TraineeService,
  ) { }

  productcards: productCards[] = [
    { id: 1, icon: 'school', title: 'Technical Trainers', total: null, available: null },
    { id: 2, icon: 'bar_chart', title: 'BH Trainers', total: null, available: null },
    { id: 3, icon: 'storefront', title: 'Coaches', total: null, available: null },
    { id: 4, icon: 'groups', title: 'Mentors', total: null, available: null },
    { id: 5, icon: 'group', title: 'Trainees', total: null, available: null },
    { id: 6, icon: 'calendar_month', title: 'Cohorts', total: null, available: null },
  ];

  ngOnInit(): void {
    this.loadCounts();
  }

  private loadCounts(): void {
    forkJoin({
      tech: this.techService.fetchTechTrainerDetails('all-tech-trainers').pipe(catchError(() => of(null))),
      bh: this.bhService.fetchBhTrainersDetails('all-bh-trainers').pipe(catchError(() => of(null))),
      coaches: this.coachService.fetchCoachDetails('all-coaches').pipe(catchError(() => of(null))),
      mentors: this.mentorService.fetchMetorDetails('all-mentors').pipe(catchError(() => of(null))),
      trainees: this.traineeService.fetchAllTrainees().pipe(catchError(() => of(null))),
      cohorts: this.cohortService.fetchAllCohortsDetails('all-cohorts').pipe(catchError(() => of(null))),
    }).subscribe(({ tech, bh, coaches, mentors, trainees, cohorts }) => {
      // Technical Trainers
      if (Array.isArray(tech)) {
        const total = tech.length;
        const hasStatus = tech.some((t: any) => typeof t.status !== 'undefined');
        const available = hasStatus ? tech.filter((t: any) => (t.status || '').toLowerCase() === 'free').length : null;
        this.setCard(1, total, available);
      } else { this.setCard(1, null, null); }

      // BH Trainers
      if (Array.isArray(bh)) {
        const total = bh.length;
        const available = bh.filter((t: any) => (t.status || '').toLowerCase() === 'free').length;
        this.setCard(2, total, available);
      } else { this.setCard(2, null, null); }

      // Coaches (no availability info)
      if (Array.isArray(coaches)) {
        const total = coaches.length;
        this.setCard(3, total, null);
      } else { this.setCard(3, null, null); }

      // Mentors
      if (Array.isArray(mentors)) {
        const total = mentors.length;
        const available = mentors.filter((m: any) => (m.status || '').toLowerCase() === 'free').length;
        this.setCard(4, total, available);
      } else { this.setCard(4, null, null); }

      // Trainees - no availability concept
      if (Array.isArray(trainees)) {
        this.setCard(5, trainees.length, null);
      } else { this.setCard(5, null, null); }

      // Cohorts - no availability concept
      if (Array.isArray(cohorts)) {
        this.setCard(6, cohorts.length, null);
      } else { this.setCard(6, null, null); }
    });
  }

  private setCard(id: number, total: number | null, available: number | null) {
    const idx = this.productcards.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.productcards[idx] = { ...this.productcards[idx], total, available };
    }
  }
}
