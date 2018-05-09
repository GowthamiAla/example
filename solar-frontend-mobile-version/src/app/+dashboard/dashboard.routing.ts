import { ModuleWithProviders } from "@angular/core"
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../+auth/guards/index';


export const routes: Routes = [
  {
    path: '', redirectTo: 'analytics', pathMatch: 'full'
  },
  {
    path: 'analytics',
    loadChildren: './+analytics/analytics.module#AnalyticsModule',
    canActivateChild: [AuthGuard]

  },
  // {
  //   path: 'social',
  //   loadChildren: './+social/social.module#SocialModule',
  //   canActivateChild: [AuthGuard]
  // }
];

export const routing = RouterModule.forChild(routes);
