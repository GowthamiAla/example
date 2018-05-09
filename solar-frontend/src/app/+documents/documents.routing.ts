import { Routes, RouterModule } from '@angular/router';

import { DocumentsListComponent } from './components/list/documents.list.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '', component: DocumentsListComponent
  }
];

export const routing = RouterModule.forChild(routes);
