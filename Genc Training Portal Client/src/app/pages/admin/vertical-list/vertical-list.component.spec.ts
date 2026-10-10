import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalListComponent } from './vertical-list.component';

describe('VerticalListComponent', () => {
  let component: VerticalListComponent;
  let fixture: ComponentFixture<VerticalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
