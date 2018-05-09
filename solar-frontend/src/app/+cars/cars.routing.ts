import { Routes, RouterModule } from '@angular/router';
import { CarsListComponent } from './components/list/cars.list.component';
import { CarAddComponent } from './components/add/cars.add.component';
import { CarUpdateComponent } from './components/update/car.update.component';
const routes: Routes = [
  {
    path: '', component: CarsListComponent, data: { pageTitle: 'Cars Details' }
  },
  {
    path: 'addCar', component: CarAddComponent, data: { pageTitle: 'Add Car' }
  },
  {
    path: 'updateCar/:id', component: CarUpdateComponent, data: { pageTitle: 'Edit Car' }
  }
];


export const routing = RouterModule.forChild(routes);
