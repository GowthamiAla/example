
import { ModuleWithProviders } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';
import { LoadDetailsComponent } from './+loadDetails/loadDetails.component';
import { LoadListComponent } from './+loadList/loadList.component.ts';

export const routes: Routes = [

  {
    path: '',
    component: LoadListComponent
  },
  {
    path: 'loadDetails/:id',
    component: LoadDetailsComponent
  },

];

export const routing = RouterModule.forChild(routes);
