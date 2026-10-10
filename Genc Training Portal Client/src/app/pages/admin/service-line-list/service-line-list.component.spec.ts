import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLineListComponent } from './service-line-list.component';

describe('ServiceLineListComponent', () => {
  let component: ServiceLineListComponent;
  let fixture: ComponentFixture<ServiceLineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceLineListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceLineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
