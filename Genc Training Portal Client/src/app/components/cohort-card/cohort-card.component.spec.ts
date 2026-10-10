import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CohortCardComponent } from './cohort-card.component';

describe('CohortCardComponent', () => {
  let component: CohortCardComponent;
  let fixture: ComponentFixture<CohortCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CohortCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CohortCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
