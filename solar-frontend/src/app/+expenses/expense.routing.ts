import { Routes, RouterModule } from '@angular/router';

import { Expense } from './expense.component';
import { ExpensesListComponent } from './components/list/expenses.list.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '', component: ExpensesListComponent
  }
];

export const routing = RouterModule.forChild(routes);
