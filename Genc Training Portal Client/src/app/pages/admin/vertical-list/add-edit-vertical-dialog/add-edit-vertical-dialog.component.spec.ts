import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVerticalDialogComponent } from './add-edit-vertical-dialog.component';

describe('AddEditVerticalDialogComponent', () => {
  let component: AddEditVerticalDialogComponent;
  let fixture: ComponentFixture<AddEditVerticalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditVerticalDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditVerticalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
