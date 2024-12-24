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
  displayedColumns: string[] = ['date', 'weight', 'neck', 'upperArm', 'chest', 'waist', 'hips', 'wrist', 'thighs', 'calves', 'ankles', 'bmi', 'actions'];
  dataSource = new MatTableDataSource<Measurement>();
  height: number = 0;
  currentUnit: WeightUnit = 'kg';

  constructor(
    private measurementService: MeasurementService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.measurementService.getHeight().subscribe(height => {
      this.height = height;
    });

    this.measurementService.getWeightUnit().subscribe(unit => {
      this.currentUnit = unit;
      // Refresh table data when unit changes
      //this.loadData();
    });

    this.measurementService.getMeasurements().subscribe(measurements => {
      this.dataSource.data = measurements.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  formatWeight(weight: number): string {
    // Weight is stored in kg, convert if needed
    const displayWeight = this.currentUnit === 'lb' 
      ? this.measurementService.convertWeight(weight, 'kg', 'lb')
      : weight;
    return `${displayWeight.toFixed(1)} ${this.currentUnit}`;
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

  calculateBMI(weight: number, height?: number): number {
    // BMI = weight(lb) / [height(inches)]2 × 703
    const heightInInches = height; // You might want to add height to your form
    return (weight / (heightInInches! * heightInInches!)) * 703;
  }

  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }
}