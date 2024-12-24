import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MeasurementService,
  WeightUnit,
} from '../../services/measurement.service';

@Component({
  selector: 'app-measurement-form',
  templateUrl: './measurement-form.component.html',
  styleUrls: ['./measurement-form.component.scss'],
})
export class MeasurementFormComponent {
  measurementForm!: FormGroup;
  currentUnit: WeightUnit = 'kg';

  constructor(
    private fb: FormBuilder,
    private measurementService: MeasurementService
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.measurementForm = this.fb.group({
      date: [new Date(), Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]],
      neck: ['', [Validators.required, Validators.min(0)]],
      upperArm: ['', [Validators.required, Validators.min(0)]],
      chest: ['', [Validators.required, Validators.min(0)]],
      waist: ['', [Validators.required, Validators.min(0)]],
      hips: ['', [Validators.required, Validators.min(0)]],
      wrist: ['', [Validators.required, Validators.min(0)]],
      thighs: ['', [Validators.required, Validators.min(0)]],
      calves: ['', [Validators.required, Validators.min(0)]],
      ankles: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.measurementForm.valid) {
      const formValue = this.measurementForm.value;
      // Convert weight to kg for storage if needed
      if (this.currentUnit === 'lb') {
        formValue.weight = this.measurementService.convertWeight(
          formValue.weight,
          'lb',
          'kg'
        );
      }
      this.measurementService.addMeasurement(formValue);
      this.measurementForm.reset({ date: new Date() });
    }
  }

  getWeightLabel(): string {
    return `Weight (${this.currentUnit})`;
  }
}
