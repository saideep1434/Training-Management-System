import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditServiceLineDialogComponent } from './add-edit-service-line-dialog.component';

describe('AddEditServiceLineDialogComponent', () => {
  let component: AddEditServiceLineDialogComponent;
  let fixture: ComponentFixture<AddEditServiceLineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditServiceLineDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditServiceLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
