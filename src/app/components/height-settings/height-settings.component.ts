import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeasurementService } from '../../services/measurement.service';

@Component({
  selector: 'app-height-settings',
  templateUrl: './height-settings.component.html',
  styleUrls: ['./height-settings.component.scss']
})
export class HeightSettingsComponent implements OnInit {
  heightForm: FormGroup;
  showForm = false;

  constructor(
    private fb: FormBuilder,
    private measurementService: MeasurementService
  ) {
    this.heightForm = this.fb.group({
      feet: ['', [Validators.required, Validators.min(0), Validators.max(8)]],
      inches: ['', [Validators.required, Validators.min(0), Validators.max(11)]]
    });
  }

  ngOnInit(): void {
    this.measurementService.getHeight().subscribe(height => {
      if (height) {
        const feet = Math.floor(height / 12);
        const inches = height % 12;
        this.heightForm.patchValue({ feet, inches });
      }
    });
  }

  onSubmit(): void {
    if (this.heightForm.valid) {
      const feet = this.heightForm.get('feet')?.value || 0;
      const inches = this.heightForm.get('inches')?.value || 0;
      const totalInches = (feet * 12) + inches;
      this.measurementService.setHeight(totalInches);
      this.showForm = false;
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }
}