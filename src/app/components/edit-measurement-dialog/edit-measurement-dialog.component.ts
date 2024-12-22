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
    public dialogRef: MatDialogRef<EditMeasurementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Measurement
  ) {
    this.editForm = this.fb.group({
      id: [data.id],
      date: [new Date(data.date), Validators.required],
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
      this.dialogRef.close(this.editForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}