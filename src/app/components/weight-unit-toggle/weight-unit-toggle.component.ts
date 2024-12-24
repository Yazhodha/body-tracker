import { Component, OnInit } from '@angular/core';
import { MeasurementService, WeightUnit } from '../../services/measurement.service';

@Component({
  selector: 'app-weight-unit-toggle',
  templateUrl: './weight-unit-toggle.component.html',
  styleUrls: ['./weight-unit-toggle.component.scss']
})
export class WeightUnitToggleComponent implements OnInit {
  currentUnit: WeightUnit = 'kg';

  constructor(private measurementService: MeasurementService) {}

  ngOnInit(): void {
    this.measurementService.getWeightUnit().subscribe(unit => {
      this.currentUnit = unit;
    });
  }

  toggleUnit(): void {
    const newUnit: WeightUnit = this.currentUnit === 'kg' ? 'lb' : 'kg';
    this.measurementService.setWeightUnit(newUnit);
  }
}