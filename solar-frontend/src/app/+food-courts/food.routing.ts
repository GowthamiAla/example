import { Routes, RouterModule } from '@angular/router';

import { Food } from './food.component';
import { FoodListComponent } from './components/list/food.list.component';
import { FoodAddComponent } from './components/add/food.add.component';
import { FoodUpdateComponent } from './components/update/food.update.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '', component: FoodListComponent
  },
  {
    path: 'addFood', component: FoodAddComponent
  },
  {
    path: 'updateFoodCourt/:Id', component: FoodUpdateComponent
  }
];

export const routing = RouterModule.forChild(routes);
