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
  editForm: FormGroup;
  currentUnit: WeightUnit = 'kg';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditMeasurementDialogComponent>,
    private measurementService: MeasurementService,
    @Inject(MAT_DIALOG_DATA) public data: Measurement
  ) {
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    // Subscribe to weight unit changes
    this.measurementService.getWeightUnit().subscribe(unit => {
      const oldUnit = this.currentUnit;
      this.currentUnit = unit;
      
      // Convert weight value when unit changes
      if (oldUnit !== unit) {
        const currentWeight = this.editForm.get('weight')?.value;
        if (currentWeight) {
          const convertedWeight = this.measurementService.convertWeight(
            currentWeight,
            oldUnit,
            unit
          );
          this.editForm.patchValue({ weight: convertedWeight });
        }
      }
    });
  }

  private createForm(): FormGroup {
    const weight = this.currentUnit === 'lb'
      ? this.measurementService.convertWeight(this.data.weight, 'kg', 'lb')
      : this.data.weight;

    return this.fb.group({
      id: [this.data.id],
      date: [new Date(this.data.date), [Validators.required]],
      weight: [weight, [Validators.required, Validators.min(0)]],
      neck: [this.data.neck, [Validators.required, Validators.min(0)]],
      upperArm: [this.data.upperArm, [Validators.required, Validators.min(0)]],
      chest: [this.data.chest, [Validators.required, Validators.min(0)]],
      waist: [this.data.waist, [Validators.required, Validators.min(0)]],
      hips: [this.data.hips, [Validators.required, Validators.min(0)]],
      wrist: [this.data.wrist, [Validators.required, Validators.min(0)]],
      thighs: [this.data.thighs, [Validators.required, Validators.min(0)]],
      calves: [this.data.calves, [Validators.required, Validators.min(0)]],
      ankles: [this.data.ankles, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      
      // Convert weight to kg for storage if needed
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