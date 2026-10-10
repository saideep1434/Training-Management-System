import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLocationDialogComponent } from './add-edit-location-dialog.component';

describe('AddEditLocationDialogComponent', () => {
  let component: AddEditLocationDialogComponent;
  let fixture: ComponentFixture<AddEditLocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditLocationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditLocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
