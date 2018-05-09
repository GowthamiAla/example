import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './template-routing';
import { SmartadminModule } from '../../shared/smartadmin.module'
import { SmartadminDatatableModule } from "../../shared/ui/datatable/smartadmin-datatable.module";
import { SmartadminEditorsModule } from "../../shared/forms/editors/smartadmin-editors.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplateService } from './service/template.service';
import { TemplateListComponent } from "./template-list/template.list.component";
import { TemplateAddComponent } from "./template-add/template.add.component";
import { TemplateEditComponent,SummernoteDirective } from "./template-edit/template.edit.component";
import {SmartadminFormsModule} from '../../shared/forms/smartadmin-forms.module';

@NgModule({
  imports: [
    CommonModule,
    routing, SmartadminModule, SmartadminDatatableModule, FormsModule, ReactiveFormsModule, SmartadminEditorsModule,SmartadminFormsModule
  ],
  declarations: [TemplateListComponent, TemplateAddComponent, TemplateEditComponent,SummernoteDirective],
  providers: [TemplateService]
})
export class TemplateModule { }
