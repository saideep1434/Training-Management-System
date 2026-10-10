import { Component, Input } from '@angular/core';


import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';



@Component({
    selector: 'app-card',
    standalone: true,
    imports: [MaterialModule, TablerIconsModule],
    templateUrl: './card.component.html',
})
export class AppCardComponent {
    @Input() title: string = '';
    @Input() total: string = '';
    @Input() percentageChange: number;
    @Input() statusText: string = '';
    @Input() iconName: string = 'currency-dollar'; // Tabler icon name

}
