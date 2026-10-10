import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
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
import { MaterialModule } from 'src/app/material.module';
import { CohortService } from 'src/app/services/cohort.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface yearlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, TablerIconsModule,CommonModule],
  templateUrl: './pie-chart.component.html',
  //styleUrl: './pie-chart.component.scss'
  encapsulation: ViewEncapsulation.None,
})
export class PieChartComponent {

  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public yearlyChart!: Partial<yearlyChart> | any;
        public locations: { name: string; count: number; color: string }[] = [];
        public dataNotice: string | null = null;

        constructor(private cohortService: CohortService) {

                // Try to load real cohorts and group by location; fall back to placeholders with a clear notice
                this.cohortService.fetchAllCohortsDetails('all-cohorts')
                    .pipe(catchError(err => {
                        console.warn('PieChart: using placeholder data (fetch failed).', err);
                        this.dataNotice = 'Data unavailable — showing sample data';
                        return of([]);
                    }))
                    .subscribe((cohorts: any[]) => {
                        if (Array.isArray(cohorts) && cohorts.length > 0) {
                            const grouped = new Map<string, number>();
                            cohorts.forEach(c => {
                                const loc = (c.location || 'Unknown');
                                grouped.set(loc, (grouped.get(loc) || 0) + 1);
                            });
                            // Assign deterministic colors for up to ~8 locations
                            const palette = ["#A7C7E7","#FFB6C1","#FFD1DC","#B3E5FC","#D5A6BD","#C3E8D8","#FDD5B1","#E1BEE7"];  
                            this.locations = Array.from(grouped.entries()).map(([name, count], idx) => ({ name, count, color: palette[idx % palette.length] }));
                        } else {
                            this.dataNotice = 'Data unavailable — showing sample data';
                            this.locations = [
                                { name: "Chennai", count: 11, color: "#A7C7E7" },
                                { name: "Coimbatore", count: 12, color: "#FFB6C1" },
                                { name: "Kochi", count: 18, color: "#FFD1DC" },
                                { name: "Bangalore", count: 14, color: "#B3E5FC" },
                                { name: "Hyderabad", count: 10, color: "#D5A6BD" },
                                { name: "Pune", count: 16, color: "#C3E8D8" },
                                { name: "Kolkata", count: 25, color: "#FDD5B1" },
                            ];
                        }

        this.yearlyChart = {

            color: "#adb5bd",
            // series: [11, 12, 18, 14, 10, 16, 25],
            // labels: ["Chennai", "Coimbatore", "Kochi","Bangalore","Hyderabad","Pune","Kolkata"],
            series: this.locations.map(loc => loc.count),
            labels: this.locations.map(loc => loc.name),
            chart: {
                width: 250,
                type: "donut",
                fontFamily: "inherit",
                foreColor: "#adb0bb",
            },
    
            // plotOptions: {
            //     pie: {
            //         startAngle: 0,
            //         endAngle: 360,
            //         donut: {
            //             size: "75%",
            //         },
            //     },
            // },

            plotOptions: {
                pie: { donut: { size: "75%" } },
            },

            stroke: {
                show: false,
            },

            dataLabels: {
                enabled: false,
            },

            legend: {
                show: false,
            },
            // colors: ['#A7C7E7', '#FFB6C1', '#FFD1DC', '#B3E5FC', '#D5A6BD', '#C3E8D8', '#FDD5B1'],
            colors: this.locations.map(loc => loc.color),

            responsive: [
                {
                    breakpoint: 991,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            tooltip: {
                theme: "dark",
                fillSeriesColor: false,
                y: {
                    formatter: (value: any, options: any) => {
                        const seriesIndex = options.seriesIndex;
                        return `${this.locations[seriesIndex]?.name}: ${value} cohorts`;
                    }
                }
            },
                };

            });
        }
}
