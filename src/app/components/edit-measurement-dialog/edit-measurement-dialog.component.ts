import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Measurement } from '../../models/measurement';

@Component({
  selector: 'app-edit-measurement-dialog',
  templateUrl: './edit-measurement-dialog.component.html',
  styleUrls: ['./edit-measurement-dialog.component.scss']
})
export class EditMeasurementDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditMeasurementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Measurement
  ) {
    this.editForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [this.data.id],
      date: [new Date(this.data.date), [Validators.required]],
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
      // Preserve the weight value from the original measurement
      this.dialogRef.close({
        ...formValue,
        weight: this.data.weight
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}