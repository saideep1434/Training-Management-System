import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerConnectDialogComponent } from './trainer-connect-dialog.component';

describe('TrainerConnectDialogComponent', () => {
  let component: TrainerConnectDialogComponent;
  let fixture: ComponentFixture<TrainerConnectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerConnectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerConnectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
