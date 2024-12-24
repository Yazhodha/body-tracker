import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MeasurementService } from '../../services/measurement.service';
import { Measurement } from '../../models/measurement';
import { EditMeasurementDialogComponent } from '../edit-measurement-dialog/edit-measurement-dialog.component';

@Component({
  selector: 'app-measurement-table',
  templateUrl: './measurement-table.component.html',
  styleUrls: ['./measurement-table.component.scss']
})
export class MeasurementTableComponent implements OnInit {
  displayedColumns: string[] = [
    'date', 
    'neck', 
    'upperArm', 
    'chest', 
    'waist', 
    'hips', 
    'wrist', 
    'thighs', 
    'calves', 
    'ankles', 
    'actions'
  ];
  
  dataSource = new MatTableDataSource<Measurement>();

  constructor(
    private measurementService: MeasurementService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.measurementService.getMeasurements().subscribe(measurements => {
      // Filter out weight-only entries
      const bodyMeasurements = measurements.filter(m => this.hasMeasurements(m));
      
      this.dataSource.data = bodyMeasurements.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
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

  // Helper method to check if a measurement entry has any body measurements
  hasMeasurements(measurement: Measurement): boolean {
    return Boolean(
      measurement.neck ||
      measurement.upperArm ||
      measurement.chest ||
      measurement.waist ||
      measurement.hips ||
      measurement.wrist ||
      measurement.thighs ||
      measurement.calves ||
      measurement.ankles
    );
  }
}