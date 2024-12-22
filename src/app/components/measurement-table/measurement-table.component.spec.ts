import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementTableComponent } from './measurement-table.component';

describe('MeasurementTableComponent', () => {
  let component: MeasurementTableComponent;
  let fixture: ComponentFixture<MeasurementTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeasurementTableComponent]
    });
    fixture = TestBed.createComponent(MeasurementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
