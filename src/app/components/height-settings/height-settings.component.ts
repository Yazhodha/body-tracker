import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeasurementService } from '../../services/measurement.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-height-settings',
  templateUrl: './height-settings.component.html',
  styleUrls: ['./height-settings.component.scss']
})
export class HeightSettingsComponent implements OnInit {
  heightForm: FormGroup;
  showForm = false;
  currentHeight: { feet: number, inches: number } | null = null;

  constructor(
    private fb: FormBuilder,
    private measurementService: MeasurementService,
    private snackBar: MatSnackBar
  ) {
    this.heightForm = this.fb.group({
      feet: ['', [Validators.required, Validators.min(0), Validators.max(8)]],
      inches: ['', [Validators.required, Validators.min(0), Validators.max(11)]]
    });
  }

  ngOnInit(): void {
    this.measurementService.getHeight().subscribe(totalInches => {
      if (totalInches) {
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        this.currentHeight = { feet, inches };
        this.heightForm.patchValue({ feet, inches });
      }
    });
  }

  onSubmit(): void {
    if (this.heightForm.valid) {
      const feet = this.heightForm.get('feet')?.value || 0;
      const inches = this.heightForm.get('inches')?.value || 0;
      
      this.measurementService.setHeight(feet, inches);
      this.showForm = false;
      
      this.snackBar.open('Height updated successfully', 'Close', {
        duration: 3000
      });
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }
}