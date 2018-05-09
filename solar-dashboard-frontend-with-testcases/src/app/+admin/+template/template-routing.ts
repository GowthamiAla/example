import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateListComponent } from './template-list/template.list.component';
import { TemplateAddComponent } from './template-add/template.add.component';
import { TemplateEditComponent } from './template-edit/template.edit.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },

  {
    path: 'editTemplate/:templateId',
    component: TemplateEditComponent,
    data: { pageTitle: 'Edit Template' }
  },
  {
    path: 'list',
    component: TemplateListComponent,
    data: { pageTitle: 'Template Details' }
  },
  {
    path: 'add',
    component: TemplateAddComponent,
    data: { pageTitle: 'Add Template' }
  }

];



export const routing = RouterModule.forChild(routes)
