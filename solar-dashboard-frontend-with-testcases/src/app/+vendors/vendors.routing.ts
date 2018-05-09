import { Routes, RouterModule } from '@angular/router';
import { VendorsListComponent } from './components/list/vendors.list.component';
import { VendorAddComponent } from './components/add/vendors.add.component';
import { VendorUpdateComponent } from './components/update/vendors.update.component';
const routes: Routes = [
  {
    path: '', component: VendorsListComponent, data: { pageTitle: 'Vendor Details' }
  },
  {
    path: 'addVendor', component: VendorAddComponent, data: { pageTitle: 'Add Vendor' }
  },
  {
    path: 'updateVendor/:vendorNbr', component: VendorUpdateComponent, data: { pageTitle: 'Update Vendor' }
  }
];


export const routing = RouterModule.forChild(routes);
