import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from "angular2-datatable";
import { routing } from './loads.routing';
import { LoadsListComponent } from './components/list/loads.list.component';
import { LoadAddComponent } from './components/add/load.add.component';
import { LoadUpdateComponent } from './components/update/load.update.component';
import { LoadDataFilterPipe } from '../shared/pipes/loaddata-filter.pipe';
import { ModalModule } from "ng2-modal";
import { MyDatePickerModule } from 'mydatepicker';
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
    MyDatePickerModule,
    SelectModule
  ],
  declarations: [
    LoadsListComponent,
    LoadAddComponent,
    LoadUpdateComponent,
    LoadDataFilterPipe,

  ]
})
export  class LoadsModule { }
