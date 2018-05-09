import { NgModule } from '@angular/core';

import { SmartadminModule } from '../shared/smartadmin.module'

import { routing } from './admin.routing';
import { DatatablesShowcaseComponent } from './+loggers/datatables-showcase.component';
import { HealthTablesComponent } from './+health/health-tables.component';
import { SmartadminDatatableModule } from '../shared/ui/datatable/smartadmin-datatable.module';
import { DatatablesRestDemoComponent } from './+loggers/datatables-rest-demo.component';
import { AuthService } from '../+auth/auth.service';

import { NotificationsTreeComponent } from '../+notifications/+notifications-tree/notifications-tree.component';
import { NotificationService } from '../+notifications/notifications.service'

import { ActivitiesService } from '../shared/layout/header/activities/activities.service';

import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';


import { TreeViewModule } from '../shared/ui/tree-view/tree-view.module';

import { TicketsGrouping } from '../+notifications/+notifications-edit/notifications-edit.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as highcharts from 'highcharts';

import { Error500Module } from '../+auth/+error/+error500/error500.module';
export function highchartsFactory() {
  const highcharts = require('highcharts');
  const highChartsMore = require('highcharts/highcharts-more');
  const solidGauge = require('highcharts/modules/solid-gauge');
  ChartModule.forRoot(require('highcharts'),
    require('highcharts/highcharts-more'),
    require('highcharts/modules/solid-gauge'));
  return highcharts;
}
declare var require: any;
@NgModule({
  declarations: [
    DatatablesShowcaseComponent, DatatablesRestDemoComponent, HealthTablesComponent, NotificationsTreeComponent, TicketsGrouping
  ],
  imports: [
    SmartadminModule,
    SmartadminDatatableModule,
    routing,
    ChartModule, Error500Module, TreeViewModule, FormsModule, ReactiveFormsModule
  ],
  providers: [AuthService,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }, NotificationService, ActivitiesService]
})
export class AdminModule { }
  // ChartModule.forRoot(require('highcharts')
	// 	,require('highcharts/highcharts-more')
	// 	,require('highcharts/modules/solid-gauge')),
