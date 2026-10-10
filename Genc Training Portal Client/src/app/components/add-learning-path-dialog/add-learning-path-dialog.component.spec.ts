import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLearningPathDialogComponent } from './add-learning-path-dialog.component';

describe('AddLearningPathDialogComponent', () => {
  let component: AddLearningPathDialogComponent;
  let fixture: ComponentFixture<AddLearningPathDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLearningPathDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLearningPathDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
