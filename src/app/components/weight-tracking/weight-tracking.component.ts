import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MeasurementService, WeightUnit } from '../../services/measurement.service';
import { WeightEntry } from 'src/app/models/weight-entry';

@Component({
  selector: 'app-weight-tracking',
  templateUrl: './weight-tracking.component.html',
  styleUrls: ['./weight-tracking.component.scss']
})
export class WeightTrackingComponent implements OnInit {
  weightForm: FormGroup;
  currentUnit: WeightUnit = 'kg';
  dataSource = new MatTableDataSource<WeightEntry>();
  displayedColumns: string[] = ['date', 'weight', 'bmi', 'actions'];

  constructor(
    private fb: FormBuilder,
    private measurementService: MeasurementService
  ) {
    this.weightForm = this.fb.group({
      date: [new Date(), Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.measurementService.getWeightUnit().subscribe(unit => {
      this.currentUnit = unit;
      this.loadWeightEntries();
    });

    this.measurementService.getMeasurements().subscribe(() => {
      this.loadWeightEntries();
    });
  }

  onSubmit(): void {
    if (this.weightForm.valid) {
      const formValue = this.weightForm.value;
      
      // Convert weight to kg if needed
      if (this.currentUnit === 'lb') {
        formValue.weight = this.measurementService.convertWeight(
          formValue.weight,
          'lb',
          'kg'
        );
      }

      this.measurementService.addMeasurement({
        ...formValue,
        // Add null values for other measurements
        neck: null,
        upperArm: null,
        chest: null,
        waist: null,
        hips: null,
        wrist: null,
        thighs: null,
        calves: null,
        ankles: null
      });

      this.weightForm.patchValue({ weight: '' });
    }
  }

  loadWeightEntries(): void {
    this.measurementService.getMeasurements().subscribe(measurements => {
      const weightEntries = measurements.map(m => ({
        id: m.id,
        date: new Date(m.date),
        weight: m.weight
      }));

      this.dataSource.data = weightEntries.sort((a, b) => 
        b.date.getTime() - a.date.getTime()
      );
    });
  }

  formatWeight(weightInKg: number): string {
    const weight = this.currentUnit === 'lb' 
      ? this.measurementService.convertWeight(weightInKg, 'kg', 'lb')
      : weightInKg;
    return weight.toFixed(1);
  }

  calculateBMI(weightInKg: number): number | null {
    return this.measurementService.calculateBMI(weightInKg);
  }

  getBMICategory(bmi: number): string {
    return this.measurementService.getBMICategory(bmi);
  }

  deleteEntry(entry: WeightEntry): void {
    if (confirm('Are you sure you want to delete this weight entry?')) {
      this.measurementService.deleteMeasurement(entry.id!);
    }
  }
}