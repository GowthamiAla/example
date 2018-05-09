

import { NgModule } from '@angular/core';
import { SmartadminModule } from '../shared/smartadmin.module';

import { LoadDetailsComponent } from './+loadDetails/loadDetails.component';
import { LoadListComponent } from './+loadList/loadList.component.ts';

import { routing } from './loads.routing';

import {LoadServices} from './loads.service';

import { NavigateMapsComponent } from './navigate-map/navigate-map.component';

@NgModule({
  imports: [routing, SmartadminModule],
  declarations: [LoadDetailsComponent, LoadListComponent],
  exports: [],
  providers: [LoadServices],
})
export class LoadsModule { }
