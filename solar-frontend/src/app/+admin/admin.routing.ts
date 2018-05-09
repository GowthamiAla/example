
import { ModuleWithProviders } from "@angular/core"
import { RouterModule, Routes } from "@angular/router";

import { DatatablesShowcaseComponent } from "./+loggers/datatables-showcase.component";
import { HealthTablesComponent } from "./+health/health-tables.component";



//import { NotificationChannelsComponent } from '../+notifications/+notifications-channels/notifications-channels.component'
import { NotificationsTreeComponent } from '../+notifications/+notifications-tree/notifications-tree.component';

import { AuthGuard } from '../+auth/guards/index';

export const routes: Routes = [

  {
    path: 'loggers',
    component: DatatablesShowcaseComponent,
    data: { pageTitle: 'Loggers Details' },
    canActivate: [AuthGuard],

  },
  {
    path: '',
    component: HealthTablesComponent,
    data: { pageTitle: 'Health Details' },
    canActivate: [AuthGuard],

  },

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
    path: 'widget',
    loadChildren: './+widgets/widget.module#WidgetModule',
    canActivateChild: [AuthGuard],
  },
   {
    path: 'report',
    loadChildren: './+reports/report.module#ReportModule',
    canActivateChild: [AuthGuard],
  },
  {
    path: 'users',
    loadChildren: './+users/users.module#UserModule',
    canActivateChild: [AuthGuard],
  }
];


export const routing = RouterModule.forChild(routes)
