import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDomainDialogComponent } from './add-edit-domain-dialog.component';

describe('AddEditDomainDialogComponent', () => {
  let component: AddEditDomainDialogComponent;
  let fixture: ComponentFixture<AddEditDomainDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditDomainDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDomainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
