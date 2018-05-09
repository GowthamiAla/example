import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmartadminValidationModule } from '../../shared/forms/validation/smartadmin-validation.module';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { AuthService } from '../auth.service';
@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule, FormsModule,
    ReactiveFormsModule,
    SmartadminValidationModule,
    SmartadminModule
  ],
  declarations: [RegisterComponent],
  providers:[AuthService]
})
export class RegisterModule { }
