import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightUnitToggleComponent } from './weight-unit-toggle.component';

describe('WeightUnitToggleComponent', () => {
  let component: WeightUnitToggleComponent;
  let fixture: ComponentFixture<WeightUnitToggleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeightUnitToggleComponent]
    });
    fixture = TestBed.createComponent(WeightUnitToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
