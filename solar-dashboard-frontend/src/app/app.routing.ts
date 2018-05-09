/**
 * Created by griga on 7/11/16.
 */


import { Routes, RouterModule, Data } from '@angular/router';
import { MainLayoutComponent } from "./shared/layout/app-layouts/main-layout.component";
import { AuthLayoutComponent } from "./shared/layout/app-layouts/auth-layout.component";
import { ModuleWithProviders } from "@angular/core";

import { AuthGuard } from './+auth/guards/index';
import { userRoleGuard } from './+auth/guards/userRole.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        // data: { pageTitle: 'Dashboard' },
        children: [

            { path: '', canActivate: [AuthGuard], redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dcmanagerloads',
                loadChildren: 'app/+dc_manager/dc_manager.module#dcManagerModule',
                data: { roles: ['DCMANAGER'] }, canActivate: [AuthGuard, userRoleGuard]
            },
            {
                path: 'dashboard',
                loadChildren: 'app/+dashboard/dashboard.module#DashboardModule',
                data: { pageTitle: 'Dashboard', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard, userRoleGuard]
            },
            {
                path: 'calendar',
                loadChildren: 'app/+calendar/calendar.module#CalendarModule',
                data: { pageTitle: 'Calendar', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard, userRoleGuard]
            },

            // {
            //   path: 'users',
            //   loadChildren: 'app/+users/users.module#UserModule',
            //   data: { pageTitle: 'Users', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard]
            // },

            {
                path: 'admin',
                loadChildren: 'app/+admin/admin.module#AdminModule',
                data: { pageTitle: 'Admin', roles: ['ADMIN'] }, canActivate: [AuthGuard, userRoleGuard]
            },
            {
                path: 'notifications',
                loadChildren: 'app/+notifications/notifications.module#NotificationModule',
                data: { roles: ['USER', 'ADMIN', 'DCMANAGER'] }, canActivate: [AuthGuard, userRoleGuard]
            }

            ,
            {
                path: 'drivers',
                loadChildren: 'app/+drivers/drivers.module#DriversModule',
                data: { pageTitle: 'Drivers', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard, userRoleGuard]
            }

            ,
            {
                path: 'locations',
                loadChildren: 'app/+locations/locations.module#LocationsModule',
                data: { pageTitle: 'Locations', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard, userRoleGuard]
            }

            ,

            // {
            //     path: 'trucks',
            //     loadChildren: 'app/+trucks/trucks.module#TrucksModule',
            //     data: { pageTitle: 'Trucks', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard,userRoleGuard]
            // } ,
            {
                path: 'loads',
                loadChildren: 'app/+loads/loads.module#LoadsModule',
                data: { pageTitle: 'Loads', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard, userRoleGuard]
            },

            {
                path: 'vendors',
                loadChildren: 'app/+vendors/vendors.module#VendorsModule',
                data: { pageTitle: 'Vendors', roles: ['USER', 'ADMIN'] }, canActivate: [AuthGuard, userRoleGuard]
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
    {
        path: 'error404',
        loadChildren: './+auth/+error/+error404/error404.module#Error404Module'
    },
    {
        path: 'error500',
        loadChildren: './+auth/+error/+error500/error500.module#Error500Module'
    },

    { path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule' },


    // {path: '**', redirectTo: 'miscellaneous/error404'}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
