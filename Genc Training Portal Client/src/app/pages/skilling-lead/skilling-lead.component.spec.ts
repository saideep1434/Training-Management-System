import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillingLeadComponent } from './skilling-lead.component';

describe('SkillingLeadComponent', () => {
  let component: SkillingLeadComponent;
  let fixture: ComponentFixture<SkillingLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillingLeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillingLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
