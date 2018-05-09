import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTableModule } from "angular2-datatable";
import { routing } from './vendors.routing';
import { VendorsListComponent } from './components/list/vendors.list.component';
import { VendorAddComponent } from './components/add/vendors.add.component';
import { VendorUpdateComponent } from './components/update/vendors.update.component';
import { SelectModule } from 'angular2-select';

import { Error500Module } from '../+auth/+error/+error500/error500.module';


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
    SelectModule,
    Error500Module
  ],
  declarations: [
    VendorsListComponent,
    VendorAddComponent,
    VendorUpdateComponent,
  ]
})
export class VendorsModule { }
