import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './expense.routing';
import { Expense } from './expense.component';
import { ExpensesListComponent } from './components/list/expenses.list.component';

import { SmartadminModule } from "../shared/smartadmin.module";
import { DataTableModule } from "angular2-datatable";
import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";


import { ModalModule } from "ng2-modal";
import { SelectModule } from 'angular2-select';


import { ExpensesFilterPipe } from '../shared/pipes/expensesdata-filter.pipe';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    routing,

    SmartadminModule,
    SmartadminDatatableModule,
    DataTableModule,

    ModalModule,
    SelectModule
  ],
  declarations: [
    Expense,
    ExpensesListComponent,
    ExpensesFilterPipe

  ]
})
export class ExpensesModule { }
