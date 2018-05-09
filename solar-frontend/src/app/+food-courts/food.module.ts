import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Ng2PopupModule }  from 'ng2-popup';
import { DataTableModule } from "angular2-datatable";

import { routing }       from './food.routing';

import { Food } from './food.component';
import { FoodListComponent } from './components/list/food.list.component';
import { FoodAddComponent } from './components/add/food.add.component';
import { FoodUpdateComponent } from './components/update/food.update.component';

import { FoodCourtFilterPipe } from '../shared/pipes/foodcourt-filter.pipe';
import { ModalModule } from "ng2-modal";
import { FlashMessagesModule } from 'angular2-flash-messages';

import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";
import { SmartadminModule } from "../shared/smartadmin.module";



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    DataTableModule,
    // Ng2PopupModule,
    ModalModule,
    FlashMessagesModule,
    SmartadminDatatableModule,
    SmartadminModule
  ],
  declarations: [
    Food,
    FoodListComponent,
    FoodAddComponent,
    FoodUpdateComponent,
    FoodCourtFilterPipe
  ]
})
export  class FoodModule {}
