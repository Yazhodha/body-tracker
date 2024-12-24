import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MeasurementService, WeightUnit } from '../../services/measurement.service';
import { Measurement } from '../../models/measurement';
import { EditMeasurementDialogComponent } from '../edit-measurement-dialog/edit-measurement-dialog.component';

@Component({
  selector: 'app-measurement-table',
  templateUrl: './measurement-table.component.html',
  styleUrls: ['./measurement-table.component.scss']
})
export class MeasurementTableComponent implements OnInit {
  displayedColumns: string[] = [
    'date', 'weight', 'neck', 'upperArm', 'chest', 'waist', 
    'hips', 'wrist', 'thighs', 'calves', 'ankles', 'bmi', 'actions'
  ];
  dataSource = new MatTableDataSource<Measurement>();
  currentUnit: WeightUnit = 'kg';

  constructor(
    private measurementService: MeasurementService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Subscribe to measurements
    this.measurementService.getMeasurements().subscribe(measurements => {
      this.dataSource.data = measurements.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    // Subscribe to weight unit changes
    this.measurementService.getWeightUnit().subscribe(unit => {
      this.currentUnit = unit;
    });
  }

  formatWeight(weightInKg: number): string {
    const displayWeight = this.currentUnit === 'lb' 
      ? this.measurementService.convertWeight(weightInKg, 'kg', 'lb')
      : weightInKg;
    return `${displayWeight.toFixed(1)}`;
  }

  calculateBMI(weightInKg: number): number | null {
    return this.measurementService.calculateBMI(weightInKg);
  }

  getBMICategory(bmi: number): string {
    return this.measurementService.getBMICategory(bmi);
  }

  editMeasurement(measurement: Measurement): void {
    const dialogRef = this.dialog.open(EditMeasurementDialogComponent, {
      width: '800px',
      data: { ...measurement }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.measurementService.updateMeasurement(result);
      }
    });
  }

  deleteMeasurement(id: number): void {
    if (confirm('Are you sure you want to delete this measurement?')) {
      this.measurementService.deleteMeasurement(id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}