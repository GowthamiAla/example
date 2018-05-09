import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from "./auth.routing";
import { AuthComponent } from './auth.component';

import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule,

    routing,
  ],
  declarations: [AuthComponent],
  providers: [AuthService]
})
export class AuthModule { }
