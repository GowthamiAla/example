import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routing } from './dashboard.routing';
import { Dashboard } from './dashboard.component';
import { LiveTrackingComponent } from './components/liveTracking/liveTracking.component';
import { DriverLocationsComponent } from './components/driverLocations/driverLocations.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DashboardsServices } from './services/dashboards.services';
import { DashboardDriverService } from './services/driverLocations.services';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { dcLoadAnalysis1Component } from './components/dcLoadAnalysis1/dcLoadAnalysis1.component';
import { dcLoadAnalysis2Component } from './components/dcLoadAnalysis2/dcLoadAnalysis2.component';
import { SelectModule } from 'angular2-select';

import { SmartadminModule } from '../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../shared/ui/datatable/smartadmin-datatable.module';
import { MyDatePickerModule } from 'mydatepicker';

import { Error500Module } from '../+auth/+error/+error500/error500.module';

@NgModule({
  imports: [
    BsDropdownModule,
    SmartadminModule,
    SmartadminDatatableModule,
    CommonModule,
    FormsModule,
    routing,
    SelectModule,
    MyDatePickerModule,
    Error500Module
  ],
  declarations: [
    Dashboard,
    DriverLocationsComponent,
    LiveTrackingComponent,
    AnalyticsComponent,
    dcLoadAnalysis1Component,
    dcLoadAnalysis2Component
  ],
  providers: [
    DashboardsServices,
    DashboardDriverService
  ]
})
export  class DashboardModule { }
