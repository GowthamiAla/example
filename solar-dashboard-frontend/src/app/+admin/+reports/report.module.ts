import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './report-routing';
import { SmartadminModule } from '../../shared/smartadmin.module'
import { SmartadminDatatableModule } from "../../shared/ui/datatable/smartadmin-datatable.module";
import { SmartadminEditorsModule } from "../../shared/forms/editors/smartadmin-editors.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from './service/report.service';
import { ReportListComponent } from "./report-list/report.list.component";
import { ReportAddComponent } from "./report-add/report.add.component";
import { ReportEditComponent } from "./report-edit/report.edit.component";
import { SmartadminFormsModule } from '../../shared/forms/smartadmin-forms.module';



@NgModule({
  imports: [
    CommonModule,
    routing, SmartadminModule, SmartadminDatatableModule, FormsModule, ReactiveFormsModule, SmartadminEditorsModule, SmartadminFormsModule
  ],
  declarations: [ReportListComponent, ReportAddComponent, ReportEditComponent, ],
  providers: [ReportService]
})
export class ReportModule { }
