import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Measurement } from '../models/measurement';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private readonly STORAGE_KEY = 'body-measurements';
  private measurements: Measurement[] = [];
  private measurementsSubject = new BehaviorSubject<Measurement[]>([]);

  constructor() {
    this.loadMeasurements();
  }

  private loadMeasurements(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.measurements = JSON.parse(saved).map((m: any) => ({
        ...m,
        date: new Date(m.date)
      }));
      this.measurementsSubject.next(this.measurements);
    }
  }

  getMeasurements(): Observable<Measurement[]> {
    return this.measurementsSubject.asObservable();
  }

  addMeasurement(measurement: Measurement): void {
    const newMeasurement = {
      ...measurement,
      id: Date.now(),
      date: new Date(measurement.date)
    };
    this.measurements.push(newMeasurement);
    this.saveMeasurements();
  }

  deleteMeasurement(id: number): void {
    this.measurements = this.measurements.filter(m => m.id !== id);
    this.saveMeasurements();
  }

  private saveMeasurements(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.measurements));
    this.measurementsSubject.next(this.measurements);
  }
}