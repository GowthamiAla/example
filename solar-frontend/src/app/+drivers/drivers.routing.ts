import { Routes, RouterModule } from '@angular/router';
import { DriversListComponent } from './components/list/drivers.list.component';
import { DriverAddComponent } from './components/add/driver.add.component';
import { DriverUpdateComponent } from './components/update/driver.update.component';
const routes: Routes = [
  {
    path: '', component: DriversListComponent, data: { pageTitle: 'Drivers Details' }
  },
  {
    path: 'addDriver', component: DriverAddComponent, data: { pageTitle: 'Add Driver' }
  },
  {
    path: 'updateDriver/:employeeID', component: DriverUpdateComponent, data: { pageTitle: 'Edit Driver' }
  }
];

export const routing = RouterModule.forChild(routes);
