import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Measurement } from '../../models/measurement';
import { MeasurementService, WeightUnit } from 'src/app/services/measurement.service';

@Component({
  selector: 'app-edit-measurement-dialog',
  templateUrl: './edit-measurement-dialog.component.html',
  styleUrls: ['./edit-measurement-dialog.component.scss']
})
export class EditMeasurementDialogComponent {
  editForm!: FormGroup;
  currentUnit: WeightUnit = 'kg';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditMeasurementDialogComponent>,
    private measurementService: MeasurementService,
    @Inject(MAT_DIALOG_DATA) public data: Measurement
  ) {
    this.createForm(data);
  }

  private createForm(data: Measurement): void {
    const weight = this.currentUnit === 'lb'
      ? this.measurementService.convertWeight(data.weight, 'kg', 'lb')
      : data.weight;

    this.editForm = this.fb.group({
      id: [data.id],
      date: [new Date(data.date), Validators.required],
      weight: [weight, [Validators.required, Validators.min(0)]],
      neck: [data.neck, [Validators.required, Validators.min(0)]],
      upperArm: [data.upperArm, [Validators.required, Validators.min(0)]],
      chest: [data.chest, [Validators.required, Validators.min(0)]],
      waist: [data.waist, [Validators.required, Validators.min(0)]],
      hips: [data.hips, [Validators.required, Validators.min(0)]],
      wrist: [data.wrist, [Validators.required, Validators.min(0)]],
      thighs: [data.thighs, [Validators.required, Validators.min(0)]],
      calves: [data.calves, [Validators.required, Validators.min(0)]],
      ankles: [data.ankles, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      // Convert weight back to kg for storage if needed
      if (this.currentUnit === 'lb') {
        formValue.weight = this.measurementService.convertWeight(
          formValue.weight,
          'lb',
          'kg'
        );
      }
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}