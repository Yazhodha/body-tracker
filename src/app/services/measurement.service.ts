import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Measurement } from '../models/measurement';

export type WeightUnit = 'kg' | 'lb';

@Injectable({
  providedIn: 'root',
})
export class MeasurementService {
  private readonly STORAGE_KEY = 'body-measurements';
  private readonly HEIGHT_KEY = 'user-height';
  private readonly WEIGHT_UNIT_KEY = 'weight-unit';
  private measurements: Measurement[] = [];
  private height: number = 0; // stored in inches
  private measurementsSubject = new BehaviorSubject<Measurement[]>([]);
  private heightSubject = new BehaviorSubject<number>(0);
  private weightUnitSubject = new BehaviorSubject<WeightUnit>('kg');

  constructor() {
    this.loadMeasurements();
    this.loadHeight();
    this.loadWeightUnit();
  }

  // Height methods
  private loadHeight(): void {
    const savedHeight = localStorage.getItem(this.HEIGHT_KEY);
    if (savedHeight) {
      this.height = parseFloat(savedHeight);
      this.heightSubject.next(this.height);
    }
  }

  setHeight(feet: number, inches: number): void {
    const totalInches = (feet * 12) + inches;
    this.height = totalInches;
    localStorage.setItem(this.HEIGHT_KEY, totalInches.toString());
    this.heightSubject.next(totalInches);
  }

  getHeight(): Observable<number> {
    return this.heightSubject.asObservable();
  }

  getHeightInMeters(): number {
    return this.height * 0.0254; // Convert inches to meters
  }

  // Weight unit methods
  private loadWeightUnit(): void {
    const savedUnit = localStorage.getItem(this.WEIGHT_UNIT_KEY) as WeightUnit;
    if (savedUnit) {
      this.weightUnitSubject.next(savedUnit);
    }
  }

  setWeightUnit(unit: WeightUnit): void {
    localStorage.setItem(this.WEIGHT_UNIT_KEY, unit);
    this.weightUnitSubject.next(unit);
  }

  getWeightUnit(): Observable<WeightUnit> {
    return this.weightUnitSubject.asObservable();
  }

  // Weight conversion methods
  convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
    if (fromUnit === toUnit) return weight;
    if (fromUnit === 'lb' && toUnit === 'kg') return weight * 0.453592;
    return weight * 2.20462; // kg to lb
  }

  // BMI calculation
  calculateBMI(weightInKg: number): number | null {
    if (!this.height) return null;
    
    const heightInMeters = this.getHeightInMeters();
    return weightInKg / (heightInMeters * heightInMeters);
  }

  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  // Measurement methods
  private loadMeasurements(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.measurements = JSON.parse(saved).map((m: any) => ({
        ...m,
        date: new Date(m.date),
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
      date: new Date(measurement.date),
    };
    this.measurements.push(newMeasurement);
    this.saveMeasurements();
  }

  updateMeasurement(measurement: Measurement): void {
    const index = this.measurements.findIndex((m) => m.id === measurement.id);
    if (index !== -1) {
      this.measurements[index] = {
        ...measurement,
        date: new Date(measurement.date),
      };
      this.saveMeasurements();
    }
  }

  deleteMeasurement(id: number): void {
    this.measurements = this.measurements.filter((m) => m.id !== id);
    this.saveMeasurements();
  }

  replaceMeasurements(measurements: Measurement[]): void {
    this.measurements = measurements.map(m => ({
      ...m,
      date: new Date(m.date),
      id: m.id || Date.now()
    }));
    this.saveMeasurements();
  }

  private saveMeasurements(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.measurements));
    this.measurementsSubject.next(this.measurements);
  }
}