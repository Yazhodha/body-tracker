import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeasurementService } from '../../services/measurement.service';

@Component({
  selector: 'app-measurement-form',
  templateUrl: './measurement-form.component.html',
  styleUrls: ['./measurement-form.component.scss']
})
export class MeasurementFormComponent {
  measurementForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private measurementService: MeasurementService
  ) {
    this.measurementForm = this.fb.group({
      date: [new Date(), Validators.required],
      neck: ['', [Validators.required, Validators.min(0)]],
      upperArm: ['', [Validators.required, Validators.min(0)]],
      chest: ['', [Validators.required, Validators.min(0)]],
      waist: ['', [Validators.required, Validators.min(0)]],
      hips: ['', [Validators.required, Validators.min(0)]],
      wrist: ['', [Validators.required, Validators.min(0)]],
      thighs: ['', [Validators.required, Validators.min(0)]],
      calves: ['', [Validators.required, Validators.min(0)]],
      ankles: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.measurementForm.valid) {
      this.measurementService.addMeasurement(this.measurementForm.value);
      this.measurementForm.reset({ date: new Date() });
    }
  }
}