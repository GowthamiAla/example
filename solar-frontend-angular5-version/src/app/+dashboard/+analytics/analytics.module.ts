import { NgModule } from '@angular/core';

import { SmartadminModule } from '../../shared/smartadmin.module'

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';


@NgModule({
  imports: [
    SmartadminModule,
    AnalyticsRoutingModule,

  ],
  declarations: [AnalyticsComponent
  ],
  providers: [],
})
export class AnalyticsModule {

}
