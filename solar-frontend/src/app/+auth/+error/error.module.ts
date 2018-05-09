import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminModule} from "../../shared/smartadmin.module";

@NgModule({
  imports: [
    CommonModule,
    ErrorRoutingModule,FormsModule,
    SmartadminValidationModule,
    ReactiveFormsModule,
    SmartadminModule
  ],
  declarations: [ErrorComponent]
})
export class ErrorModule { }
