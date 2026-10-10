import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechTrainerComponent } from './tech-trainer.component';

describe('TechTrainerComponent', () => {
  let component: TechTrainerComponent;
  let fixture: ComponentFixture<TechTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechTrainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
