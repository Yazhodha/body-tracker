import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WeightEntry } from '../models/weight-entry';
import { BodyMeasurement } from '../models/measurement';

export type WeightUnit = 'kg' | 'lb';

@Injectable({
  providedIn: 'root',
})
export class MeasurementService {
  private readonly MEASUREMENTS_KEY = 'body-measurements';
  private readonly WEIGHTS_KEY = 'weight-entries';
  private readonly HEIGHT_KEY = 'user-height';
  private readonly WEIGHT_UNIT_KEY = 'weight-unit';

  private bodyMeasurements: BodyMeasurement[] = [];
  private weightEntries: WeightEntry[] = [];
  private height: number = 0; // stored in inches

  private bodyMeasurementsSubject = new BehaviorSubject<BodyMeasurement[]>([]);
  private weightEntriesSubject = new BehaviorSubject<WeightEntry[]>([]);
  private heightSubject = new BehaviorSubject<number>(0);
  private weightUnitSubject = new BehaviorSubject<WeightUnit>('kg');

  constructor() {
    this.loadBodyMeasurements();
    this.loadWeightEntries();
    this.loadHeight();
    this.loadWeightUnit();
  }

  // Body Measurements Methods
  private loadBodyMeasurements(): void {
    const saved = localStorage.getItem(this.MEASUREMENTS_KEY);
    if (saved) {
      this.bodyMeasurements = JSON.parse(saved).map((m: any) => ({
        ...m,
        date: new Date(m.date),
      }));
      this.bodyMeasurementsSubject.next(this.bodyMeasurements);
    }
  }

  getBodyMeasurements(): Observable<BodyMeasurement[]> {
    return this.bodyMeasurementsSubject.asObservable();
  }

  addBodyMeasurement(measurement: BodyMeasurement): void {
    const newMeasurement = {
      ...measurement,
      id: Date.now(),
      date: new Date(measurement.date),
    };
    this.bodyMeasurements.push(newMeasurement);
    this.saveBodyMeasurements();
  }

  updateBodyMeasurement(measurement: BodyMeasurement): void {
    const index = this.bodyMeasurements.findIndex((m) => m.id === measurement.id);
    if (index !== -1) {
      this.bodyMeasurements[index] = {
        ...measurement,
        date: new Date(measurement.date),
      };
      this.saveBodyMeasurements();
    }
  }

  deleteBodyMeasurement(id: number): void {
    this.bodyMeasurements = this.bodyMeasurements.filter((m) => m.id !== id);
    this.saveBodyMeasurements();
  }

  private saveBodyMeasurements(): void {
    localStorage.setItem(this.MEASUREMENTS_KEY, JSON.stringify(this.bodyMeasurements));
    this.bodyMeasurementsSubject.next(this.bodyMeasurements);
  }

  // Weight Entries Methods
  private loadWeightEntries(): void {
    const saved = localStorage.getItem(this.WEIGHTS_KEY);
    if (saved) {
      this.weightEntries = JSON.parse(saved).map((w: any) => ({
        ...w,
        date: new Date(w.date),
      }));
      this.weightEntriesSubject.next(this.weightEntries);
    }
  }

  getWeightEntries(): Observable<WeightEntry[]> {
    return this.weightEntriesSubject.asObservable();
  }

  addWeightEntry(entry: WeightEntry): void {
    const newEntry = {
      ...entry,
      id: Date.now(),
      date: new Date(entry.date),
    };
    this.weightEntries.push(newEntry);
    this.saveWeightEntries();
  }

  updateWeightEntry(entry: WeightEntry): void {
    const index = this.weightEntries.findIndex((w) => w.id === entry.id);
    if (index !== -1) {
      this.weightEntries[index] = {
        ...entry,
        date: new Date(entry.date),
      };
      this.saveWeightEntries();
    }
  }

  deleteWeightEntry(id: number): void {
    this.weightEntries = this.weightEntries.filter((w) => w.id !== id);
    this.saveWeightEntries();
  }

  private saveWeightEntries(): void {
    localStorage.setItem(this.WEIGHTS_KEY, JSON.stringify(this.weightEntries));
    this.weightEntriesSubject.next(this.weightEntries);
  }

  // Height Methods
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

  // Weight Unit Methods
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

  // Weight Conversion and BMI Methods
  convertWeight(weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
    if (fromUnit === toUnit) return weight;
    if (fromUnit === 'lb' && toUnit === 'kg') return weight * 0.453592;
    return weight * 2.20462; // kg to lb
  }

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

  // For Import/Export Support
  replaceAllData(bodyMeasurements: BodyMeasurement[], weightEntries: WeightEntry[]): void {
    this.bodyMeasurements = bodyMeasurements.map(m => ({
      ...m,
      date: new Date(m.date),
      id: m.id || Date.now()
    }));
    this.saveBodyMeasurements();

    this.weightEntries = weightEntries.map(w => ({
      ...w,
      date: new Date(w.date),
      id: w.id || Date.now()
    }));
    this.saveWeightEntries();
  }
}