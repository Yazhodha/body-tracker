import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MeasurementFormComponent } from './components/measurement-form/measurement-form.component';
import { MeasurementTableComponent } from './components/measurement-table/measurement-table.component';
import { ProgressChartComponent } from './components/progress-chart/progress-chart.component';
import { EditMeasurementDialogComponent } from './components/edit-measurement-dialog/edit-measurement-dialog.component';
import { HeightSettingsComponent } from './components/height-settings/height-settings.component';
import { WeightUnitToggleComponent } from './components/weight-unit-toggle/weight-unit-toggle.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MeasurementFormComponent,
    MeasurementTableComponent,
    ProgressChartComponent,
    EditMeasurementDialogComponent,
    HeightSettingsComponent,
    WeightUnitToggleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }