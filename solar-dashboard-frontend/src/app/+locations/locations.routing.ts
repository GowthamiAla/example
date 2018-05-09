import { Routes, RouterModule } from '@angular/router';

//import { Locations } from './locations.component';
import { LocationsListComponent } from './components/list/locations.list.component';
import { LocationAddComponent } from './components/add/location.add.component';
import { LocationUpdateComponent } from './components/update/location.update.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '', component: LocationsListComponent,  data: { pageTitle: 'Locations Details' }
  },
  {
   path: 'locations/addLocation', component: LocationAddComponent,  data: { pageTitle: 'Add Location' }
  },
  {
    path: 'updateLocation/:locNbr', component: LocationUpdateComponent,  data: { pageTitle: 'Edit Location' }
  }
];

export const routing = RouterModule.forChild(routes);
