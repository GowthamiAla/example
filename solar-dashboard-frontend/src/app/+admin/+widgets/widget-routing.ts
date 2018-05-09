import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetListComponent } from './widget-list/widget.list.component';
import { WidgetAddComponent } from './widget-add/widget.add.component';
import { WidgetEditComponent } from './widget-edit/widget.edit.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },

  {
    path: 'editWidget/:widgetId',
    component: WidgetEditComponent,
    data: { pageTitle: 'Edit Widget' }
  },
  {
    path: 'list',
    component: WidgetListComponent,
    data: { pageTitle: 'Widget Details' }
  },
  {
    path: 'add',
    component: WidgetAddComponent,
    data: { pageTitle: 'Add Widget' }
  }

];



export const routing = RouterModule.forChild(routes)
