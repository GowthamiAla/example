
import { NgModule } from '@angular/core';
import { SmartadminModule } from '../shared/smartadmin.module';
import { ClusterMapsComponent } from './map/maps.component';
import { MapStyleService } from './shared/map-style.service';
import { GoogleAPIService } from './shared/google-api.service';
import { routing } from './maps.routing';
import { LoadServices } from '../+loads/loads.service';


@NgModule({
  imports: [routing, SmartadminModule],
  declarations: [ClusterMapsComponent],
  exports: [],
  providers: [GoogleAPIService, MapStyleService, LoadServices],
})
export class MapsModule {

}
