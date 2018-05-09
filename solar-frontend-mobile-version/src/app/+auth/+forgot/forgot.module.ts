import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotRoutingModule } from './forgot-routing.module';
import { ForgotComponent } from './forgot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminModule} from "../../shared/smartadmin.module";

@NgModule({
  imports: [
    CommonModule,
    ForgotRoutingModule,FormsModule,
    SmartadminValidationModule,
    ReactiveFormsModule,
    SmartadminModule
  ],
  declarations: [ForgotComponent]
})
export class ForgotModule { }
