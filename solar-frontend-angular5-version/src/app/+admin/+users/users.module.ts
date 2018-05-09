import { NgModule } from '@angular/core';

import { SmartadminModule } from '../../shared/smartadmin.module';
import { SmartadminDatatableModule } from '../../shared/ui/datatable/smartadmin-datatable.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing } from './user.routing';

import { UsersListComponent } from './+users-list/users-list.component';
import { AddUserComponent } from './+add-user/add-user.component';
import { EditUserComponent } from './+edit-user/edit-user.component';


import { UserService } from './user.service'

import { Error500Module } from '../../+auth/+error/+error500/error500.module'; 

import {EventsService} from '../../+calendar/shared/events.service';

@NgModule({
  declarations: [
    EditUserComponent, UsersListComponent, AddUserComponent
  ],
  imports: [
    SmartadminModule,
    SmartadminDatatableModule,
    Error500Module,
    routing,
    FormsModule, ReactiveFormsModule, 
  ],
  providers: [UserService, EventsService]
})
export class UserModule { }