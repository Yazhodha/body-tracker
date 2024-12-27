import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MeasurementService, WeightUnit } from '../../services/measurement.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { WeightEntry } from '../../models/weight-entry';
import { BodyMeasurement } from 'src/app/models/measurement';

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent implements OnInit {
  @Input() chartType: 'weight' | 'measurements' = 'measurements';
  @ViewChild('weightChart') weightChart?: BaseChartDirective;
  @ViewChild('bodyChart') bodyChart?: BaseChartDirective;

  currentUnit: WeightUnit = 'kg';
  weightEntries: WeightEntry[] = [];
  bodyMeasurements: BodyMeasurement[] = [];

  weightChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: []
  };

  bodyChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: []
  };

  weightChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Weight'
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

  bodyChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: false
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

  bodyMeasurementTypes = [
    { id: 'neck', name: 'Neck', color: '#A4C2F4' },
    { id: 'upperArm', name: 'Upper Arm', color: '#F4B5B5' },
    { id: 'chest', name: 'Chest', color: '#FFE599' },
    { id: 'waist', name: 'Waist', color: '#B6D7A8' },
    { id: 'hips', name: 'Hips', color: '#D5A6BD' },
    { id: 'wrist', name: 'Wrist', color: '#D9E2F3' },
    { id: 'thighs', name: 'Thighs', color: '#E6B8B7' },
    { id: 'calves', name: 'Calves', color: '#B4A7D6' },
    { id: 'ankles', name: 'Ankles', color: '#F9CB9C' }
  ];

  selectedMeasurements: string[] = ['waist', 'chest', 'hips'];

  constructor(private measurementService: MeasurementService) {}

  ngOnInit(): void {
    this.measurementService.getWeightUnit().subscribe(unit => {
      this.currentUnit = unit;
      this.updateWeightChart();
    });

    // Subscribe to both data sources
    this.measurementService.getWeightEntries().subscribe(entries => {
      this.weightEntries = entries;
      if (this.chartType === 'weight') {
        this.updateWeightChart();
      }
    });

    this.measurementService.getBodyMeasurements().subscribe(measurements => {
      this.bodyMeasurements = measurements;
      if (this.chartType === 'measurements') {
        this.updateBodyChart();
      }
    });
  }

  private updateChartYAxisLabel(): void {
    if (this.weightChartOptions?.scales?.['y']) {
      const yAxis = this.weightChartOptions.scales['y'];
      if ('title' in yAxis) {
        yAxis.title = {
          display: true,
          text: `Weight (${this.currentUnit})`
        };
      }
    }
    this.weightChart?.update();
  }

  private updateWeightChart(): void {
    this.updateChartYAxisLabel();
    
    if (this.weightEntries.length === 0) return;

    const sortedEntries = [...this.weightEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedEntries.map(m => 
      new Date(m.date).toLocaleDateString()
    );

    this.weightChartData = {
      labels,
      datasets: [{
        label: 'Weight',
        data: sortedEntries.map(m => {
          const weightInKg = m.weight;
          return this.currentUnit === 'lb' 
            ? this.measurementService.convertWeight(weightInKg, 'kg', 'lb')
            : weightInKg;
        }),
        borderColor: '#FF9800',
        backgroundColor: '#FF9800',
        tension: 0.4
      }]
    };

    this.weightChart?.update();
  }

  private updateBodyChart(): void {
    if (this.bodyMeasurements.length === 0) return;

    const sortedMeasurements = [...this.bodyMeasurements].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedMeasurements.map(m => 
      new Date(m.date).toLocaleDateString()
    );

    this.bodyChartData = {
      labels,
      datasets: this.selectedMeasurements.map(measurementType => {
        const measurementInfo = this.bodyMeasurementTypes.find(m => m.id === measurementType)!;
        return {
          label: measurementInfo.name,
          data: sortedMeasurements.map(m => m[measurementType as keyof typeof m] as number),
          borderColor: measurementInfo.color,
          backgroundColor: measurementInfo.color,
          tension: 0.4
        };
      })
    };

    this.bodyChart?.update();
  }

  toggleMeasurement(measurementId: string): void {
    const index = this.selectedMeasurements.indexOf(measurementId);
    if (index === -1) {
      this.selectedMeasurements.push(measurementId);
    } else {
      this.selectedMeasurements.splice(index, 1);
    }
    this.updateBodyChart();
  }

  isMeasurementSelected(measurementId: string): boolean {
    return this.selectedMeasurements.includes(measurementId);
  }
}