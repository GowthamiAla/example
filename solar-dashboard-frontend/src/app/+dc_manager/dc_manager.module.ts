import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './dc_manager.routing.ts';

import { SmartadminModule } from '../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../shared/ui/datatable/smartadmin-datatable.module';

import { DataTableModule } from 'angular2-datatable';

import { dcLoadsComponent } from './+loads/list/loads.component';

import { dcMnagerService } from './dc_manager.service';

import { Error500Module } from '../+auth/+error/+error500/error500.module';
@NgModule({
    imports: [

        SmartadminModule,
        SmartadminDatatableModule,
        ReactiveFormsModule,
        FormsModule,
        routing,
        DataTableModule,
        Error500Module
    ],
    declarations: [
        dcLoadsComponent,
    ],
    providers: [dcMnagerService]
})
export class dcManagerModule { }
