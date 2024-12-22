import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MeasurementService } from '../../services/measurement.service';
import { Measurement } from '../../models/measurement';

@Component({
  selector: 'app-measurement-table',
  templateUrl: './measurement-table.component.html',
  styleUrls: ['./measurement-table.component.scss']
})
export class MeasurementTableComponent implements OnInit {
  displayedColumns: string[] = ['date', 'neck', 'upperArm', 'chest', 'waist', 'hips', 'wrist', 'thighs', 'calves', 'ankles', 'actions'];
  dataSource = new MatTableDataSource<Measurement>();

  constructor(private measurementService: MeasurementService) {}

  ngOnInit(): void {
    this.measurementService.getMeasurements().subscribe(measurements => {
      this.dataSource.data = measurements.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
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