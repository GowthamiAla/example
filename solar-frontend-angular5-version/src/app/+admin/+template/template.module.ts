import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './template-routing';
import { SmartadminModule } from '../../shared/smartadmin.module'
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { SmartadminEditorsModule } from '../../shared/forms/editors/smartadmin-editors.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplateService } from './service/template.service';
import { TemplateListComponent } from './template-list/template.list.component';
import { TemplateAddComponent } from './template-add/template.add.component';
import { TemplateEditComponent, SummernoteDirective } from './template-edit/template.edit.component';
import { SmartadminFormsModule } from '../../shared/forms/smartadmin-forms.module';
import { Error500Module } from '../../+auth/+error/+error500/error500.module'; 
@NgModule({
  imports: [
    CommonModule,
    routing, SmartadminModule,Error500Module, SmartadminDatatableModule, FormsModule, ReactiveFormsModule, SmartadminEditorsModule, SmartadminFormsModule
  ],
  declarations: [TemplateListComponent, TemplateAddComponent, TemplateEditComponent, SummernoteDirective],
  providers: [TemplateService]
})
export class TemplateModule { }
