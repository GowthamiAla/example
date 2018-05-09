import { Routes, RouterModule } from '@angular/router';

import { Dashboard } from './dashboard.component';
import { LiveTrackingComponent } from './components/liveTracking/liveTracking.component';
import { DriverLocationsComponent } from './components/driverLocations/driverLocations.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { dcLoadAnalysis1Component } from './components/dcLoadAnalysis1/dcLoadAnalysis1.component';
import { dcLoadAnalysis2Component } from './components/dcLoadAnalysis2/dcLoadAnalysis2.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: '', redirectTo: 'driverLocation', pathMatch: 'full' },
  { path: 'driverLocation', component: DriverLocationsComponent, data: { pageTitle: 'Driver Location' }, },
  { path: 'liveTracking', component: LiveTrackingComponent, data: { pageTitle: 'Live Tracking' }, },
  { path: 'analytics', component: AnalyticsComponent, data: { pageTitle: 'Analytics' }, },
  { path: 'dcLoadAnalysis1', component: dcLoadAnalysis1Component, data: { pageTitle: 'Performance Analysis' }, },
  { path: 'dcLoadAnalysis2', component: dcLoadAnalysis2Component, data: { pageTitle: 'Vendor vs Load Analysis' }, },

];

export const routing = RouterModule.forChild(routes);
