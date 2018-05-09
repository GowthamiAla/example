import { Routes, RouterModule } from '@angular/router';
import { LoadsListComponent } from './components/list/loads.list.component';
import { LoadAddComponent } from './components/add/load.add.component';
import { LoadUpdateComponent } from './components/update/load.update.component';
const routes: Routes = [
  {
    path: '', component: LoadsListComponent,data:{pageTitle:'Loads Details'}
  },
  {
    path: 'addLoad', component: LoadAddComponent,data:{pageTitle:'Add Load'}
  },
  {
    path: 'updateLoad/:loadNum', component: LoadUpdateComponent,data:{pageTitle:'Update Load'}
  }
];

export const routing = RouterModule.forChild(routes);
