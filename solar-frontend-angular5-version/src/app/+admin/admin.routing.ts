
import { ModuleWithProviders } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';




import { NotificationsTreeComponent } from './+notifications/+notifications-tree/notifications-tree.component';

import { AuthGuard } from '../+auth/+guards/index';

export const routes: Routes = [

  


  {
    path: 'notificationstree',
    component: NotificationsTreeComponent,
    data: { pageTitle: 'Notifications List' },
    canActivate: [AuthGuard],
  },
  {
    path: 'template',
    loadChildren: './+template/template.module#TemplateModule',
    canActivateChild: [AuthGuard],
  },
 
 
  {
    path: 'users',
    loadChildren: './+users/users.module#UserModule',
    canActivateChild: [AuthGuard],
  }, {
    path: 'report',
    loadChildren: './+reports/report.module#ReportModule',
    canActivateChild: [AuthGuard],
  }
];


export const routing = RouterModule.forChild(routes)
