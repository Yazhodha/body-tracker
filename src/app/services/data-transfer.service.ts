import { Injectable } from '@angular/core';
import { MeasurementService } from './measurement.service';
import { Measurement } from '../models/measurement';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

export interface ExportData {
  version: string;
  exportDate: string;
  measurements: Measurement[];
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
      this.exportProgressSubject.next(25);
      
      // Get all necessary data using firstValueFrom for one-time subscription
      const measurements = await firstValueFrom(this.measurementService.getMeasurements());
      this.exportProgressSubject.next(50);
      
      const weightUnit = await firstValueFrom(this.measurementService.getWeightUnit());
      this.exportProgressSubject.next(75);
      
      const heightInches = await firstValueFrom(this.measurementService.getHeight());

      const exportData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        measurements: measurements || [],
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
      this.importProgressSubject.next(25);
      
      const data = JSON.parse(jsonString) as ExportData;
      
      // Validate data structure
      if (!this.isValidExportData(data)) {
        throw new Error('Invalid data format');
      }

      this.importProgressSubject.next(50);

      // Convert dates from ISO strings to Date objects
      data.measurements = data.measurements.map(m => ({
        ...m,
        date: new Date(m.date)
      }));

      this.importProgressSubject.next(75);

      // Store the imported data
      this.measurementService.setWeightUnit(data.weightUnit);
      const feet = Math.floor(data.heightInches / 12);
      const inches = data.heightInches % 12;
      this.measurementService.setHeight(feet, inches);
      
      // Replace all measurements
      this.measurementService.replaceMeasurements(data.measurements);

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
      Array.isArray(data.measurements) &&
      (data.weightUnit === 'kg' || data.weightUnit === 'lb') &&
      typeof data.heightInches === 'number'
    );
  }
}