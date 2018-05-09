import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { Ng2PopupModule } from 'ng2-popup';
import { DataTableModule } from "angular2-datatable";
import { routing } from './drivers.routing';
import { DriversListComponent } from './components/list/drivers.list.component';
import { DriverAddComponent } from './components/add/driver.add.component';
import { DriverUpdateComponent } from './components/update/driver.update.component';
import { DriverDataFilterPipe } from '../shared/pipes/driverdata-filter.pipe';
import { ModalModule } from "ng2-modal";
import { SelectModule } from 'angular2-select';
import { MyDatePickerModule } from 'mydatepicker';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { SmartadminModule } from "../shared/smartadmin.module";
import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";


@NgModule({
  imports: [
    SmartadminModule,
    SmartadminDatatableModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    DataTableModule,
    MyDatePickerModule,

    ModalModule,
    SelectModule,
    FlashMessagesModule
  ],
  declarations: [
    DriversListComponent,
    DriverAddComponent,
    DriverUpdateComponent,
    DriverDataFilterPipe
  ]
})
export class DriversModule { }


