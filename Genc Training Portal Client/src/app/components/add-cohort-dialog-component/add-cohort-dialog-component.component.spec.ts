import { ComponentFixture, TestBed } from '@angular/core/testing';

//import { AddCohortDialogComponentComponent } from './add-cohort-dialog-component.component';
import { AddCohortDialogComponent } from './add-cohort-dialog-component.component';
describe('AddCohortDialogComponentComponent', () => {
  let component: AddCohortDialogComponent;
  let fixture: ComponentFixture<AddCohortDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCohortDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCohortDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
