import { Routes, RouterModule } from '@angular/router';

import { Dashboard } from './dashboard.component';
import { LiveTrackingComponent } from './components/liveTracking/liveTracking.component';
import { DriverLocationsComponent } from './components/driverLocations/driverLocations.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: '', component: DriverLocationsComponent },
  { path: 'liveTracking', component: LiveTrackingComponent },
  { path: 'analytics', component: AnalyticsComponent }
];
 
export const routing = RouterModule.forChild(routes);
