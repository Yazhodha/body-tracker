import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DataTransferService } from 'src/app/services/data-transfer.service';

@Component({
  selector: 'app-data-transfer',
  templateUrl: './data-transfer.component.html',
  styleUrls: ['./data-transfer.component.scss']
})
export class DataTransferComponent implements OnDestroy {
  importProgress = 0;
  exportProgress = 0;
  isProcessing = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private dataTransferService: DataTransferService,
    private snackBar: MatSnackBar
  ) {
    this.subscriptions.push(
      this.dataTransferService.getImportProgress().subscribe(
        progress => {
          this.importProgress = progress;
          this.isProcessing = progress > 0;
        }
      ),
      this.dataTransferService.getExportProgress().subscribe(
        progress => {
          this.exportProgress = progress;
          this.isProcessing = progress > 0;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async exportData(): Promise<void> {
    try {
      const jsonString = await this.dataTransferService.exportToJson();
      
      // Create and trigger download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `body-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      this.snackBar.open('Data exported successfully', 'Close', {
        duration: 3000
      });
    } catch (error) {
      console.error('Export error:', error);
      this.snackBar.open('Failed to export data', 'Close', {
        duration: 3000
      });
    }
  }

  async importData(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const jsonString = await file.text();
      const result = await this.dataTransferService.importFromJson(jsonString);
      
      this.snackBar.open(
        result.success ? 'Data imported successfully' : `Import failed: ${result.message}`,
        'Close',
        { duration: 3000 }
      );

      // Clear the file input
      (event.target as HTMLInputElement).value = '';
    } catch (error) {
      console.error('Import error:', error);
      this.snackBar.open('Failed to import data', 'Close', {
        duration: 3000
      });
      // Clear the file input
      (event.target as HTMLInputElement).value = '';
    }
  }
}
