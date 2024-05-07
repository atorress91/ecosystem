
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { FeatherModule } from 'angular-feather';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import {
  Facebook,
  Twitter,
  Github,
  Gitlab,
  User,
  Key,
  UserCheck,
  Mail,
} from 'angular-feather/icons';
import { MatSelectModule } from '@angular/material/select';
import { ForgotComponent } from './forgot/forgot.component';
import { Page500Component } from './page500/page500.component';
import { Page404Component } from './page404/page404.component';
import { ResetComponent } from './reset/reset.component';
import { EmailConfirmationComponent } from './email-confirmation/email.confirmation.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainOptionsComponent } from './main-options/main-options.component';
import { ConpaymentConfirmationComponent } from './conpayment-confirmation/conpayment-confirmation.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaintenancePageComponent } from './maintenance-page/maintenance-page.component';

const icons = {
  Facebook,
  Twitter,
  Github,
  Gitlab,
  User,
  Key,
  UserCheck,
  Mail,
};

@NgModule({
  declarations: [
    LandingPageComponent,
    SigninComponent,
    SignupComponent,
    ForgotComponent,
    Page500Component,
    Page404Component,
    ResetComponent,
    EmailConfirmationComponent,
    MainOptionsComponent,
    MaintenancePageComponent,
    ConpaymentConfirmationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    PerfectScrollbarModule,
    TranslateModule,
    FeatherModule.pick(icons),
    MatSelectCountryModule.forRoot('en'),
    MatSelectModule
  ]

})
export class AuthenticationModule { }
