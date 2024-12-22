import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MeasurementFormComponent } from './components/measurement-form/measurement-form.component';
import { MeasurementTableComponent } from './components/measurement-table/measurement-table.component';
import { ProgressChartComponent } from './components/progress-chart/progress-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MeasurementFormComponent,
    MeasurementTableComponent,
    ProgressChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
