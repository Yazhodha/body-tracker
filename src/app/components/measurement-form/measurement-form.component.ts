import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeasurementService } from '../../services/measurement.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-measurement-form',
  templateUrl: './measurement-form.component.html',
  styleUrls: ['./measurement-form.component.scss']
})
export class MeasurementFormComponent {
  measurementForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private measurementService: MeasurementService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  private createForm(): void {
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
      const formValue = this.measurementForm.value;
      
      // Add weight as null since it's now handled separately
      this.measurementService.addMeasurement({
        ...formValue,
        weight: null
      });

      // Reset form except date
      this.measurementForm.reset({ date: new Date() });
      
      this.snackBar.open('Measurements saved successfully', 'Close', {
        duration: 3000
      });
    }
  }
}