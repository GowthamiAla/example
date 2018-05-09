
import { NgModule } from '@angular/core';


import { CalendarWidgetComponent } from './calendar-widget/calendar-widget.component';
import { EventsService } from './shared/events.service';
import { CalendarComponent } from './calendar.component';
import { SmartadminModule } from '../shared/smartadmin.module';
import { routing } from './calendar.routing';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { KeysPipe } from '../sharedmodules/grouping.pipe';
import { NguiDatetimePickerModule, NguiDatetime } from '@ngui/datetime-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Error500Module } from '../+auth/+error/+error500/error500.module';

@NgModule({
  imports: [
    SmartadminModule,
    routing,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule,
    Error500Module
  ],

  declarations: [
    CalendarWidgetComponent,
    KeysPipe,
    CalendarComponent,
  ],
  exports: [
    CalendarWidgetComponent,
    CalendarComponent,
  ],
  providers: [EventsService]
})
export class CalendarModule { }
