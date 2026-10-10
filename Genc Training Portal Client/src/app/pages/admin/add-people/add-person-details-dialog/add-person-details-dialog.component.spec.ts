import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonDetailsDialogComponent } from './add-person-details-dialog.component';

describe('AddPersonDetailsDialogComponent', () => {
  let component: AddPersonDetailsDialogComponent;
  let fixture: ComponentFixture<AddPersonDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPersonDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPersonDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
