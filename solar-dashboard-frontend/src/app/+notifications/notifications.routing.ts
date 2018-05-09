
import { ModuleWithProviders } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';


import { NotificationListComponent } from './+notifications-list/notifications-list.component';
import { NotificationEditComponent } from './+notifications-edit/notifications-edit.component';
// import { NotificationChannelsComponent } from './+notifications-channels/notifications-channels.component';

import { AuthGuard } from '../+auth/guards/index';
export const routes: Routes = [

  {
    path: 'notificationslist',
    component: NotificationListComponent,
    data: { pageTitle: 'Notifications List' },
    canActivateChild: [AuthGuard]
  },
  {
    path: 'notificationssettings',
    component: NotificationEditComponent,
    data: { pageTitle: 'Notifications Settings' },
    canActivateChild: [AuthGuard]
  },
  //  {
  //   path: 'notificationschannels',
  //   component: NotificationChannelsComponent,
  //   data: { pageTitle: 'Notifications Channels' }
  // }
];


export const routing = RouterModule.forChild(routes)
