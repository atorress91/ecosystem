import { MembershipManagerModule } from '../client/membership-manager/membership-manager.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './app-layout/main-layout/main-layout.component';
import { AdminLayoutComponent } from './app-layout/admin-layout/admin-layout.component';
import { FooterComponent } from './footer/footer.component';
import { ClientModule } from "../client/client.module";
import { StoreLayoutComponent } from './app-layout/store-layout/store-layout.component';

@NgModule({
  imports: [CommonModule, MembershipManagerModule, ClientModule],
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent,
    FooterComponent,
    AdminLayoutComponent,
    StoreLayoutComponent,
  ],
})
export class LayoutModule { }
