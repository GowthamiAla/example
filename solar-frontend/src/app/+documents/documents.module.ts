import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { Ng2PopupModule } from 'ng2-popup';
import { routing } from './documents.routing';
import { DocumentsListComponent } from './components/list/documents.list.component';
import { DocumentDataFilterPipe } from '../shared/pipes/documentdata-filter.pipe';



import { SmartadminModule } from "../shared/smartadmin.module";
import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";



//import { Ng2PopupModule }  from 'ng2-popup';
import { DataTableModule } from "angular2-datatable";
//import { Dealers } from './dealers.component';

import { DealerDataFilterPipe } from '../shared/pipes/dealerdata-filter.pipe';
import { ModalModule } from "ng2-modal";
import { FlashMessagesModule } from 'angular2-flash-messages';



@NgModule({
  imports: [


    SmartadminModule,
    SmartadminDatatableModule,

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
  
    DataTableModule,
  ],
  declarations: [
    DocumentsListComponent,
    DocumentDataFilterPipe,


  ]
})
export class DocumentsModule { }
