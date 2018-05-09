import { NgModule } from '@angular/core';

import { SmartadminModule } from '../../shared/smartadmin.module'

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import { SocialNetworkComponent } from "./live-feeds/social-network.component";
import { LiveFeedsComponent } from "./live-feeds/live-feeds.component";
import { LiveStatsComponent } from "./live-feeds/live-stats.component";
import { RevenueComponent } from "./live-feeds/revenue.component";
import { CalendarModule } from "../../+calendar/calendar.module";
import { FlotChartModule } from "../../shared/graphs/flot-chart/flot-chart.module";
import { D3Module } from "../../shared/graphs/d3/d3.module";




@NgModule({
  imports: [
    SmartadminModule,
    AnalyticsRoutingModule,
    CalendarModule,
    FlotChartModule,
    D3Module,
  ],
  declarations: [
    AnalyticsComponent,

    LiveFeedsComponent,
    LiveStatsComponent,
    RevenueComponent,
    SocialNetworkComponent
  ],
  providers: [],
})
export class AnalyticsModule {

}
