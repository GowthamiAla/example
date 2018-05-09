import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTableModule } from "angular2-datatable";
import { routing } from './cars.routing';
import { CarsListComponent } from './components/list/cars.list.component';
import { CarAddComponent } from './components/add/cars.add.component';
import { CarUpdateComponent } from './components/update/car.update.component';
import { VinDataFilterPipe } from '../shared/pipes/vindata-filter.pipe';
import { ModalModule } from "ng2-modal";
import { FlashMessagesModule } from 'angular2-flash-messages';
import { SelectModule } from 'angular2-select';




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
    ModalModule,
    FlashMessagesModule,
    SelectModule
  ],
  declarations: [
    CarsListComponent,
    CarAddComponent,
    CarUpdateComponent,
    VinDataFilterPipe
  ]
})
export class CarsModule { }
