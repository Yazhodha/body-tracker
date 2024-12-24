import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightTrackingComponent } from './weight-tracking.component';

describe('WeightTrackingComponent', () => {
  let component: WeightTrackingComponent;
  let fixture: ComponentFixture<WeightTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeightTrackingComponent]
    });
    fixture = TestBed.createComponent(WeightTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
