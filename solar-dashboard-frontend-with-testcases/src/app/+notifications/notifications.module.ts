import { NgModule } from '@angular/core';
import { SmartadminModule } from '../shared/smartadmin.module'
import { routing } from './notifications.routing';
import { SmartadminDatatableModule } from '../shared/ui/datatable/smartadmin-datatable.module';

import { NotificationListComponent } from './+notifications-list/notifications-list.component';
import { NotificationEditComponent } from './+notifications-edit/notifications-edit.component';
import { TicketsGrouping } from './+notifications-tree/notifications-tree.component';
// import { NotificationChannelsComponent } from './+notifications-channels/notifications-channels.component';

import { NotificationService } from './notifications.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActivitiesService } from '../shared/layout/header/activities/activities.service';
import { EventsService } from '../+calendar/shared/events.service';
import { Error500Module } from '../+auth/+error/+error500/error500.module';
@NgModule({
  declarations: [
    NotificationListComponent, NotificationEditComponent, TicketsGrouping
  ],
  imports: [
    SmartadminModule,
    SmartadminDatatableModule,
    Error500Module,
    routing,
    FormsModule, ReactiveFormsModule
  ],
  providers: [NotificationService, ActivitiesService, EventsService]
})
export class NotificationModule { }

