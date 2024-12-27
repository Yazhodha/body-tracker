import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MeasurementService, WeightUnit } from '../../services/measurement.service';
import { WeightEntry } from '../../models/weight-entry';

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
    // Subscribe to weight unit changes
    this.measurementService.getWeightUnit().subscribe(unit => {
      this.currentUnit = unit;
      this.loadWeightEntries();
    });

    // Initial load of weight entries
    this.loadWeightEntries();
  }

  onSubmit(): void {
    if (this.weightForm.valid) {
      const formValue = this.weightForm.value;
      const weightInKg = this.currentUnit === 'lb' 
        ? this.measurementService.convertWeight(formValue.weight, 'lb', 'kg')
        : formValue.weight;

      const entry: WeightEntry = {
        date: formValue.date,
        weight: weightInKg
      };

      this.measurementService.addWeightEntry(entry);
      this.weightForm.patchValue({ weight: '' });
    }
  }

  loadWeightEntries(): void {
    this.measurementService.getWeightEntries().subscribe(entries => {
      this.dataSource.data = entries.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
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
      this.measurementService.deleteWeightEntry(entry.id!);
    }
  }
}