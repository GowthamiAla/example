import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routing } from './dashboard.routing';
import { Dashboard } from './dashboard.component';
import { LiveTrackingComponent } from './components/liveTracking/liveTracking.component';
import { DriverLocationsComponent } from './components/driverLocations/driverLocations.component';

import { DashboardsServices } from './services/dashboards.services';
import { DashboardService } from './services/driverLocations.services';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { SelectModule } from 'angular2-select';




import { SmartadminModule } from "../shared/smartadmin.module";
import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";

@NgModule({
  imports: [

    SmartadminModule,
    SmartadminDatatableModule,
    CommonModule,
    FormsModule,
    routing,
    SelectModule
  ],
  declarations: [
    Dashboard,
    DriverLocationsComponent,
    LiveTrackingComponent,
    AnalyticsComponent
  ],
  providers: [
    DashboardsServices,
    DashboardService
  ]
})
export  class DashboardModule { }
