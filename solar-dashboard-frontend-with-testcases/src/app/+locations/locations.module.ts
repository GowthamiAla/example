import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { Ng2PopupModule }  from 'ng2-popup';
import { DataTableModule } from "angular2-datatable";
import { routing }       from './locations.routing';
//import { Dealers } from './dealers.component';
import { LocationsListComponent } from './components/list/locations.list.component';
import { LocationAddComponent } from './components/add/location.add.component';
import { LocationUpdateComponent } from './components/update/location.update.component';

import { LocationDataFilterPipe } from '../shared/pipes/locationdata-filter.pipe';

import { Error500Module } from '../+auth/+error/+error500/error500.module';

import { SmartadminModule } from "../shared/smartadmin.module";
import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";
import { MyDatePickerModule } from 'mydatepicker';


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
   Error500Module
  ],
  declarations: [
    //Locations,
    LocationsListComponent,
    LocationAddComponent,
    LocationUpdateComponent,
    LocationDataFilterPipe
  ]
})
export  class LocationsModule {}
