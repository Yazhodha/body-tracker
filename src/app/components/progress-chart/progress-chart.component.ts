import { Component, OnInit } from '@angular/core';
import { MeasurementService } from '../../services/measurement.service';
import { Chart } from 'chart.js/auto';
import { ChartConfiguration, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent implements OnInit {
  chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Measurement Progress Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Inches'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  measurementTypes = [
    { id: 'weight', name: 'Weight', color: '#FF9800' },
    { id: 'neck', name: 'Neck', color: '#A4C2F4' },
    { id: 'upperArm', name: 'Upper Arm', color: '#F4B5B5' },
    { id: 'chest', name: 'Chest', color: '#FFE599' },
    { id: 'waist', name: 'Waist', color: '#FFF2CC' },
    { id: 'hips', name: 'Hips', color: '#B6D7A8' },
    { id: 'wrist', name: 'Wrist', color: '#D9E2F3' },
    { id: 'thighs', name: 'Thighs', color: '#D5A6BD' },
    { id: 'calves', name: 'Calves', color: '#E6B8B7' },
    { id: 'ankles', name: 'Ankles', color: '#E6B8AF' }
  ];

  selectedMeasurements: string[] = ['weight', 'waist', 'chest', 'hips'];

  constructor(private measurementService: MeasurementService) {}

  ngOnInit(): void {
    this.loadChartData();
    this.measurementService.getMeasurements().subscribe(() => {
      this.loadChartData();
    });
  }

  loadChartData(): void {
    this.measurementService.getMeasurements().subscribe(measurements => {
      if (measurements.length === 0) return;

      const sortedMeasurements = measurements.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      this.chartData = {
        labels: sortedMeasurements.map(m => new Date(m.date).toLocaleDateString()),
        datasets: this.selectedMeasurements.map(measurementType => {
          const measurementInfo = this.measurementTypes.find(m => m.id === measurementType)!;
          return {
            label: measurementInfo.name,
            data: sortedMeasurements.map(m => m[measurementType as keyof typeof m] as number),
            borderColor: measurementInfo.color,
            backgroundColor: measurementInfo.color,
            tension: 0.4
          };
        })
      };
    });
  }

  toggleMeasurement(measurementId: string): void {
    const index = this.selectedMeasurements.indexOf(measurementId);
    if (index === -1) {
      this.selectedMeasurements.push(measurementId);
    } else {
      this.selectedMeasurements.splice(index, 1);
    }
    this.loadChartData();
  }

  isMeasurementSelected(measurementId: string): boolean {
    return this.selectedMeasurements.includes(measurementId);
  }
}