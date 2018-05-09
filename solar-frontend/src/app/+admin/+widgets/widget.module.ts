import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './widget-routing';
import { SmartadminModule } from '../../shared/smartadmin.module'
import { SmartadminDatatableModule } from "../../shared/ui/datatable/smartadmin-datatable.module";
import { SmartadminEditorsModule } from "../../shared/forms/editors/smartadmin-editors.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetService } from './service/widget.service';
import { WidgetListComponent } from "./widget-list/widget.list.component";
import { WidgetAddComponent } from "./widget-add/widget.add.component";
import { WidgetEditComponent,SummernoteDirective } from "./widget-edit/widget.edit.component";
import {SmartadminFormsModule} from '../../shared/forms/smartadmin-forms.module';

@NgModule({
  imports: [
    CommonModule,
    routing, SmartadminModule, SmartadminDatatableModule, FormsModule, ReactiveFormsModule, SmartadminEditorsModule,SmartadminFormsModule
  ],
  declarations: [WidgetListComponent, WidgetAddComponent, WidgetEditComponent,SummernoteDirective],
  providers: [WidgetService]
})
export class WidgetModule { }
