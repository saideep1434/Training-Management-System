import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/dashboard']">
        <img
          src="./assets/images/logos/Cognizant_Logo.png"
          class="align-middle m-2"
          alt="logo"
          width="200"
          height="50"
          
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
