import { Component, OnDestroy, OnInit } from '@angular/core';
import { TechnicalTrainerService } from 'src/app/services/trainer.service';
import { ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'app-tech-trainer',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './tech-trainer.component.html',
  styleUrl: './tech-trainer.component.css'
})
export class TechTrainerComponent {
  statsCards = [
    { title: 'Active Cohorts', value: 12, subtitle: 'Graduated Cohorts: 55' },
    { title: 'Active Trainees', value: 400, subtitle: 'Graduated Trainees: 55' },
    { title: 'Trainees Present', value: 10, subtitle: 'Absent: 55' },
    { title: 'Resigned', value: 8, subtitle: '' }
  ];

  serviceLineData: ChartConfiguration<'bar'>['data'] = {
    labels: ['SDET', 'API', 'PlayWright', 'Selenium', 'Cypress'],
    datasets: [
      { label: 'Cohorts', data: [15000, 28000, 20000, 30000, 25000], backgroundColor: ['#cbb2ff', '#a1e3f7', '#000', '#a1bfff', '#a1e3f7'] }
    ]
  };

  categoryData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['GenC Next PA', 'Regular GenC PAT', 'PAT', 'AT'],
    datasets: [
      { data: [52.1, 22.8, 13.9, 11.2], backgroundColor: ['#000', '#a1bfff', '#a1e3f7', '#cbb2ff'] }
    ]
  };

  totalCohortsData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      { label: 'Active', data: [10000, 8000, 12000, 20000, 25000, 18000, 22000], borderColor: '#000', fill: false },
      { label: 'Graduated', data: [12000, 10000, 15000, 28000, 30000, 22000, 25000], borderColor: '#4f8ef7', fill: false }
    ]
  };
}
