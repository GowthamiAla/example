import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {routing} from "./auth.routing";
import { AuthComponent } from './auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,

    routing,
      FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ AuthComponent]
})
export class AuthModule { }
