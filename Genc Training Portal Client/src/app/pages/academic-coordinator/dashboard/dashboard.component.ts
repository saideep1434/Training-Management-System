import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

import { AppCardComponent } from 'src/app/components/card/card.component';
import { DashCardsComponent } from "src/app/components/dash-cards/dash-cards.component";
import { PieChartComponent } from 'src/app/components/pie-chart/pie-chart.component';
import { BarGraphComponent } from 'src/app/components/bar-graph/bar-graph.component';



@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    DashCardsComponent,
    BarGraphComponent,
    PieChartComponent
],
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent { }