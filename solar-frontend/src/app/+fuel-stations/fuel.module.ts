import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgaModule } from '../../theme/nga.module';
// import { Ng2PopupModule }  from 'ng2-popup';
import { DataTableModule } from "angular2-datatable";

import { routing }       from './fuel.routing';

import { Fuel } from './fuel.component';
import { FuelListComponent } from './components/list/fuel.list.component';
import { FuelAddComponent } from './components/add/fuel.add.component';
import { FuelUpdateComponent } from './components/update/fuel.update.component';

import { FuelStationFilterPipe } from '../shared/pipes/fuelstation-filter.pipe';
import { ModalModule } from "ng2-modal";
import { FlashMessagesModule } from 'angular2-flash-messages';

import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";
import { SmartadminModule } from "../shared/smartadmin.module";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // NgaModule,
    routing,
    DataTableModule,
    SmartadminDatatableModule,
    SmartadminModule,
    // Ng2PopupModule,
    ModalModule,
    FlashMessagesModule
  ],
  declarations: [
    Fuel,
    FuelListComponent,
    FuelAddComponent,
    FuelUpdateComponent,
    FuelStationFilterPipe
  ]
})
export  class FuelModule {}
