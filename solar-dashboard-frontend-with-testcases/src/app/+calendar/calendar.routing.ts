import { ModuleWithProviders } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { AuthGuard } from '../+auth/guards/index';


export const routes: Routes = [

  {
    path: '',
    component: CalendarComponent,
    data: { pageTitle: 'Calendar' },
    canActivateChild: [AuthGuard]
  },


];

export const routing = RouterModule.forChild(routes);
