import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportListComponent } from "./report-list/report.list.component";
import { ReportAddComponent } from "./report-add/report.add.component";
import { ReportEditComponent } from "./report-edit/report.edit.component";

export const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },

  {
    path: 'editReport/:reportId',
    component: ReportEditComponent,
    data: { pageTitle: 'Edit Report' }
  },
  {
    path: 'list',
    component: ReportListComponent,
    data: { pageTitle: 'Report Details' }
  },
  {
    path: 'add',
    component: ReportAddComponent,
    data: { pageTitle: 'Add Report' }
  }

];
export const routing = RouterModule.forChild(routes)


