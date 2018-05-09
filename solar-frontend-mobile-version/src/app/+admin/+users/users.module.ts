import { NgModule } from '@angular/core';

import { SmartadminModule } from '../../shared/smartadmin.module'

import { routing } from './user.routing';
import { EditUserComponent } from "./+edit-user/edit-user.component";
import { AddUserComponent } from "./+add-user/add-user.component";
import { SmartadminDatatableModule } from "../../shared/ui/datatable/smartadmin-datatable.module";
import { UsersListComponent } from './+users-list/users-list.component';

import { UserService } from './user.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    EditUserComponent, UsersListComponent,AddUserComponent
  ],
  imports: [
    SmartadminModule,
    SmartadminDatatableModule,

    routing,
    FormsModule, ReactiveFormsModule
  ],
  providers: [UserService]
})
export class UserModule { }
