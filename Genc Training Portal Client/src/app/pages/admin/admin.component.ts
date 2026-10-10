import { Component } from '@angular/core';
import { AddPeopleComponent } from "./add-people/add-people.component";
import { DomainComponent } from './domain/domain.component';
import { ServiceLineListComponent } from './service-line-list/service-line-list.component';
import { LocationListComponent } from './location-list/location-list.component';
import { VerticalListComponent } from "./vertical-list/vertical-list.component";
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AddPeopleComponent, DomainComponent, ServiceLineListComponent, LocationListComponent, VerticalListComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
