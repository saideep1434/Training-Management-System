import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CohortDetailsComponent } from './cohort-details.component';

describe('CohortDetailsComponent', () => {
  let component: CohortDetailsComponent;
  let fixture: ComponentFixture<CohortDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CohortDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CohortDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
