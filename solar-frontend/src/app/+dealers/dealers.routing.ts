import { Routes, RouterModule } from '@angular/router';

//import { Dealers } from './dealers.component';
import { DealersListComponent } from './components/list/dealers.list.component';
import { DealerAddComponent } from './components/add/dealer.add.component';
import { DealerUpdateComponent } from './components/update/dealer.update.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '', component: DealersListComponent,  data: { pageTitle: 'Dealers Details' }
  },
  {
    path: 'addDealer', component: DealerAddComponent,  data: { pageTitle: 'Add Dealer' }
  },
  {
    path: 'updateDealer/:dealerCd', component: DealerUpdateComponent,  data: { pageTitle: 'Edit Dealer' }
  }
];

export const routing = RouterModule.forChild(routes);
