/**
 * Created by griga on 7/11/16.
 */


import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from "./shared/layout/app-layouts/main-layout.component";
import { AuthLayoutComponent } from "./shared/layout/app-layouts/auth-layout.component";
import { ModuleWithProviders } from "@angular/core";

import { AuthGuard } from './+auth/+guards/index';
import { userRoleGuard } from './+auth/+guards/userRole.guard';

export const routes: Routes = [
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
  {
    path: 'error404',
    loadChildren: './+auth/+error/+error404/error404.module#Error404Module'
  },
  {
    path: 'error500',
    loadChildren: './+auth/+error/+error500/error500.module#Error500Module'
  },

  { path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule' },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '', canActivate: [AuthGuard], redirectTo: 'dashboard', pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: 'app/+dashboard/dashboard.module#DashboardModule',
        data: { pageTitle: 'Dashboard', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard, userRoleGuard]
      },
      {
        path: 'admin',
        loadChildren: 'app/+admin/admin.module#AdminModule',
        data: { pageTitle: 'Admin', roles: ['ADMIN'] }, canActivate: [AuthGuard, userRoleGuard]
      },
      {
        path: 'notifications',
        loadChildren: 'app/+admin/+notifications/notifications.module#NotificationModule',
        data: { roles: ['USER', 'ADMIN', 'DCMANAGER'] }, canActivate: [AuthGuard, userRoleGuard]
      },
      {
        path: 'calendar',
        loadChildren: 'app/+calendar/calendar.module#CalendarModule',
        data: { pageTitle: 'Calendar', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard, userRoleGuard]
      },

    ]

  },


  { path: '**', redirectTo: 'Dashboard' }
  //
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
