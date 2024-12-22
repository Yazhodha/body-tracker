import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeasurementDialogComponent } from './edit-measurement-dialog.component';

describe('EditMeasurementDialogComponent', () => {
  let component: EditMeasurementDialogComponent;
  let fixture: ComponentFixture<EditMeasurementDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMeasurementDialogComponent]
    });
    fixture = TestBed.createComponent(EditMeasurementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
