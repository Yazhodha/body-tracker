import { Injectable } from '@angular/core';
import { MeasurementService } from './measurement.service';
import { WeightEntry } from '../models/weight-entry';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { BodyMeasurement } from '../models/measurement';

export interface ExportData {
  version: string;
  exportDate: string;
  bodyMeasurements: BodyMeasurement[];
  weightEntries: WeightEntry[];
  weightUnit: 'kg' | 'lb';
  heightInches: number;
}

export interface ImportResult {
  success: boolean;
  message: string;
  data?: ExportData;
}

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  private importProgressSubject = new BehaviorSubject<number>(0);
  private exportProgressSubject = new BehaviorSubject<number>(0);

  constructor(private measurementService: MeasurementService) {}

  getImportProgress(): Observable<number> {
    return this.importProgressSubject.asObservable();
  }

  getExportProgress(): Observable<number> {
    return this.exportProgressSubject.asObservable();
  }

  async exportToJson(): Promise<string> {
    try {
      this.exportProgressSubject.next(20);
      
      // Get all body measurements
      const bodyMeasurements = await firstValueFrom(this.measurementService.getBodyMeasurements());
      this.exportProgressSubject.next(40);
      
      // Get all weight entries
      const weightEntries = await firstValueFrom(this.measurementService.getWeightEntries());
      this.exportProgressSubject.next(60);
      
      // Get settings
      const weightUnit = await firstValueFrom(this.measurementService.getWeightUnit());
      const heightInches = await firstValueFrom(this.measurementService.getHeight());
      this.exportProgressSubject.next(80);

      const exportData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        bodyMeasurements: bodyMeasurements || [],
        weightEntries: weightEntries || [],
        weightUnit: weightUnit || 'kg',
        heightInches: heightInches || 0
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      this.exportProgressSubject.next(100);
      
      return jsonString;
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export data');
    } finally {
      setTimeout(() => {
        this.exportProgressSubject.next(0);
      }, 1000);
    }
  }

  async importFromJson(jsonString: string): Promise<ImportResult> {
    try {
      this.importProgressSubject.next(20);
      
      const data = JSON.parse(jsonString) as ExportData;
      
      // Validate data structure
      if (!this.isValidExportData(data)) {
        throw new Error('Invalid data format');
      }

      this.importProgressSubject.next(40);

      // Convert dates from ISO strings to Date objects
      data.bodyMeasurements = data.bodyMeasurements.map(m => ({
        ...m,
        date: new Date(m.date)
      }));

      data.weightEntries = data.weightEntries.map(w => ({
        ...w,
        date: new Date(w.date)
      }));

      this.importProgressSubject.next(60);

      // Store the settings
      this.measurementService.setWeightUnit(data.weightUnit);
      const feet = Math.floor(data.heightInches / 12);
      const inches = data.heightInches % 12;
      this.measurementService.setHeight(feet, inches);

      this.importProgressSubject.next(80);
      
      // Replace all data
      this.measurementService.replaceAllData(data.bodyMeasurements, data.weightEntries);

      this.importProgressSubject.next(100);

      return {
        success: true,
        message: 'Data imported successfully',
        data
      };
    } catch (error) {
      console.error('Import failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to import data'
      };
    } finally {
      setTimeout(() => {
        this.importProgressSubject.next(0);
      }, 1000);
    }
  }

  private isValidExportData(data: any): data is ExportData {
    return (
      data &&
      typeof data.version === 'string' &&
      typeof data.exportDate === 'string' &&
      Array.isArray(data.bodyMeasurements) &&
      Array.isArray(data.weightEntries) &&
      (data.weightUnit === 'kg' || data.weightUnit === 'lb') &&
      typeof data.heightInches === 'number' &&
      // Validate array structures
      this.isValidBodyMeasurementsArray(data.bodyMeasurements) &&
      this.isValidWeightEntriesArray(data.weightEntries)
    );
  }

  private isValidBodyMeasurementsArray(measurements: any[]): boolean {
    return measurements.every(m => 
      typeof m.date === 'string' &&
      typeof m.neck === 'number' &&
      typeof m.upperArm === 'number' &&
      typeof m.chest === 'number' &&
      typeof m.waist === 'number' &&
      typeof m.hips === 'number' &&
      typeof m.wrist === 'number' &&
      typeof m.thighs === 'number' &&
      typeof m.calves === 'number' &&
      typeof m.ankles === 'number'
    );
  }

  private isValidWeightEntriesArray(entries: any[]): boolean {
    return entries.every(e => 
      typeof e.date === 'string' &&
      typeof e.weight === 'number'
    );
  }
}