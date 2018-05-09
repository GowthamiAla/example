/**
 * Created by griga on 7/11/16.
 */


import { Routes, RouterModule, Data } from '@angular/router';
import { MainLayoutComponent } from "./shared/layout/app-layouts/main-layout.component";
import { AuthLayoutComponent } from "./shared/layout/app-layouts/auth-layout.component";
import { ModuleWithProviders } from "@angular/core";

import { AuthGuard } from './+auth/guards/index';


export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    data: { pageTitle: 'Dashboard' },
    children: [

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: 'app/+dashboard/dashboard.module#DashboardModule',
        data: { pageTitle: 'Dashboard', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard]
      },
      {
        path: 'calendar',
        loadChildren: 'app/+calendar/calendar.module#CalendarModule',
        data: { pageTitle: 'Calendar', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard]
      },

      // {
      //   path: 'users',
      //   loadChildren: 'app/+users/users.module#UserModule',
      //   data: { pageTitle: 'Users', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard]
      // },

      {
        path: 'admin',
        loadChildren: 'app/+admin/admin.module#AdminModule',
        data: { pageTitle: 'Admin', roles: ['ADMIN'] }, canActivate: [AuthGuard]
      },
      {
        path: 'notifications',
        loadChildren: 'app/+notifications/notifications.module#NotificationModule',
        data: { pageTitle: 'Notifications' , roles: ['USER', 'ADMIN']}, canActivate: [AuthGuard]
      }

    ]
  },

  {
    path: 'login',
    loadChildren: './+auth/+login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: './+auth/+register/register.module#RegisterModule',
  },
  {
    path: 'forgot-password',
    loadChildren: './+auth/+forgot/forgot.module#ForgotModule'
  },
  {
    path: 'locked',
    loadChildren: './+auth/+locked/locked.module#LockedModule'
  },
  {
    path: 'otp',
    loadChildren: './+auth/+otp/otp.module#OtpModule',
  },
  {
    path: 'error',
    loadChildren: './+auth/+error/error.module#ErrorModule',
  },

  { path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule' },


  // {path: '**', redirectTo: 'miscellaneous/error404'}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
