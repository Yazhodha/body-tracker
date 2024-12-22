import { Component } from '@angular/core';
import { MeasurementService } from '../../services/measurement.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(public measurementService: MeasurementService) {}
}