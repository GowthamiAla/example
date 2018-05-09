import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { Ng2PopupModule }  from 'ng2-popup';
import { DataTableModule } from "angular2-datatable";
import { routing }       from './dealers.routing';
//import { Dealers } from './dealers.component';
import { DealersListComponent } from './components/list/dealers.list.component';
import { DealerAddComponent } from './components/add/dealer.add.component';
import { DealerUpdateComponent } from './components/update/dealer.update.component';

import { DealerDataFilterPipe } from '../shared/pipes/dealerdata-filter.pipe';
import { ModalModule } from "ng2-modal";
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
    ModalModule,
    FlashMessagesModule
  ],
  declarations: [
    //Dealers,
    DealersListComponent,
    DealerAddComponent,
    DealerUpdateComponent,
    DealerDataFilterPipe
  ]
})
export  class DealersModule {}
