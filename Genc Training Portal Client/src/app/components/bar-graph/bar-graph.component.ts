import { Component, ViewChild, viewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { CohortService } from 'src/app/services/cohort.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface month {
  value: string;
  viewValue: string;
}

export interface OverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

@Component({
  selector: 'app-bar-graph',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule, MatButtonModule],
  templateUrl: './bar-graph.component.html',
  
})
export class BarGraphComponent {

  //@ViewChild('chart') chart: ChartComponent = Object.create(null);
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public salesOverviewChart!: Partial<OverviewChart> | any;

  months: month[] = [
    { value: 'jan', viewValue: 'Jan 2025' },
    { value: 'feb', viewValue: 'Feb 2025' },
    { value: 'march', viewValue: 'March 2025' },
    { value: 'april', viewValue: 'April 2025' },
    { value: 'may', viewValue: 'May 2025' },
    { value: 'june', viewValue: 'June 2025' },
    { value: 'july', viewValue: 'July 2025' },
    { value: 'aug', viewValue: 'Aug 2025' },
    { value: 'sep', viewValue: 'Sep 2025' },
    { value: 'oct', viewValue: 'Oct 2025' },
    { value: 'nov', viewValue: 'Nov 2025' },
    { value: 'dec', viewValue: 'Dec 2025' },
  ];


  dataNotice: string | null = null;

  constructor(private cohortService: CohortService) {

    // sales overview chart
    this.salesOverviewChart = {
      series: [
        {
          name: 'Number Of Trainees',
          data: [2000, 1784,3000, 2568, 4566, 2789, 3678],
          color: '#5D87FF',
        },
        // {
        //   name: 'Expense this month',
        //   data: [280, 250, 325, 215, 250, 310, 280, 250],
        //   color: '#49BEFF',
        // },
      ],

      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: '40%', borderRadius: [4] },
      },
      chart: {
        type: 'bar',
        height: 390,
        offsetX: -15,
        toolbar: { show: true },
        foreColor: '#adb0bb',
        fontFamily: 'inherit',
        sparkline: { enabled: false },
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: false },
      xaxis: {
        type: 'category',
        categories: [],
        labels: {
          style: { cssClass: 'grey--text lighten-2--text fill-color' },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: 5000,
        tickAmount: 10,

        // type: 'category',
        // categories: [
        //   '0',
        //   '5 k',
        //   '10 k',
        //   '15 k',
        //   '20 k',
        //   '25 k',
        //   '30 k',
        //   '35 k',
        // ],
        labels: {
          style: {
            cssClass: 'grey--text lighten-2--text fill-color',
          },
        },
      },
      stroke: {
        show: true,
        width: 3,
        lineCap: 'butt',
        colors: ['transparent'],
      },
      tooltip: { theme: 'dark' },

      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 3,
              },
            },
          },
        },
      ],
    };

    // Try to pull real cohort counts by location
    this.cohortService.fetchAllCohortsDetails('all-cohorts')
      .pipe(catchError(err => { this.dataNotice = 'Data unavailable — showing sample data'; return of([]); }))
      .subscribe((cohorts: any[]) => {
        if (Array.isArray(cohorts) && cohorts.length > 0) {
          const grouped = new Map<string, number>();
          cohorts.forEach(c => {
            const loc = (c.location || 'Unknown');
            grouped.set(loc, (grouped.get(loc) || 0) + 1);
          });
          const labels = Array.from(grouped.keys());
          const values = Array.from(grouped.values());
          this.salesOverviewChart.xaxis.categories = labels;
          this.salesOverviewChart.series[0].data = values;
        } else {
          // keep default placeholders
          if (!this.dataNotice) this.dataNotice = 'Data unavailable — showing sample data';
          this.salesOverviewChart.xaxis.categories = [ 'Chennai','Pune','Coimbatore','Kochi','Bangalore','Hyderabad','Kolkata' ];
          this.salesOverviewChart.series[0].data = [2000, 1784,3000, 2568, 4566, 2789, 3678];
        }
      });

  }
}
