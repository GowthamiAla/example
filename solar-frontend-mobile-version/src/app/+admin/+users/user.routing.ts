
import { ModuleWithProviders } from "@angular/core"
import { RouterModule, Routes } from "@angular/router";

import { EditUserComponent } from "./+edit-user/edit-user.component";
//import { DatatablesShowcaseComponent } from "./+users-list/datatables-showcase.component";
import { AddUserComponent } from "./+add-user/add-user.component";

import { UsersListComponent } from "./+users-list/users-list.component";
export const routes: Routes = [
  {
    path: 'editUser/:userId',
    component: EditUserComponent,
    data: { pageTitle: 'Edit User' }
  },
  // {
  //   path: 'datatables',
  //   component: UsersListComponent,
  //   data: { pageTitle: 'Users Details' }
  // }
  // ,
  {
    path: 'adduser',
    component: AddUserComponent,
    data: { pageTitle: 'Add User' }
  },
  {
    path: '',
    component: UsersListComponent,
    data: { pageTitle: 'Users Details' }
  }
];


export const routing = RouterModule.forChild(routes)
