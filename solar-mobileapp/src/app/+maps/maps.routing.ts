
import { ModuleWithProviders } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';
import { ClusterMapsComponent } from './map/maps.component';
// import {NavigateMapsComponent} from "./navigate-map/navigate-map.component";

export const routes: Routes = [

  {
    path: '',
    component: ClusterMapsComponent
  },
];

export const routing = RouterModule.forChild(routes);
