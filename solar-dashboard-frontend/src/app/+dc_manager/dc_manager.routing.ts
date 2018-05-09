

import { Routes, RouterModule } from '@angular/router';

import { dcLoadsComponent } from './+loads/list/loads.component';
import { AuthGuard } from '../+auth/guards/index';

const routes: Routes = [
    {
        path: '',
        component: dcLoadsComponent,
        data: { pageTitle:'Manager Loads' },
        canActivate: [AuthGuard],

    },
];

export const routing = RouterModule.forChild(routes);
