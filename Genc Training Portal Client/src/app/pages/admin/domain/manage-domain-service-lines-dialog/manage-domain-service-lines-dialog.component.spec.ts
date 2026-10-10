import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDomainServiceLinesDialogComponent } from './manage-domain-service-lines-dialog.component';

describe('ManageDomainServiceLinesDialogComponent', () => {
  let component: ManageDomainServiceLinesDialogComponent;
  let fixture: ComponentFixture<ManageDomainServiceLinesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDomainServiceLinesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDomainServiceLinesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
