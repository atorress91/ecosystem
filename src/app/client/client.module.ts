
import { TicketsModule } from './tickets/tickets.module';
import { RequestsModule } from './requests/requests.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { QrcodeModule } from 'qrcode-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ClientRoutingModule } from './client-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { Search } from 'angular-feather/icons';

import { RequestWalletComponent } from './request-wallet/request-wallet.component';
import { BillingPurchasesModule } from './billing-purchases/billing-purchases.module';
import { HomeModule } from './home/home.module';
import { BillingPurchaseComponent } from './billing-purchase/billing-purchase.component';
import { BillingOrdersComponent } from './billing-orders/billing-orders.component';
import { ProcurementEcopoolComponent } from './procurement-ecopool/procurement-ecopool.component';
import { WalletComponent } from './wallet/wallet.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { NetworkComponent } from './network/network.component';
import { InducementsComponent } from './inducements/inducements.component';
import { CommissionsBalanceComponent } from './commissions-balance/commissions-balance.component';
import { AddressesComponent } from './addresses/addresses.component';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MyProfileModule } from './my-profile/my-profile.module';
import { ConfigureWalletComponent } from './configure-wallet/configure-wallet.component';
import { CreateAddressModalComponent } from './addresses/create-address-modal/create-address-modal.component';
import { ClientUnilevelTreeModule } from '@app/client/unilevel-tree/client-unilevel-tree.module';
import { AcademyComponent } from './academy/academy.component';
import { FundingAccountsComponent } from './funding-accounts/funding-accounts.component';
import { SharedModule } from '@app/shared/shared.module';
import { NetworkDetailsComponent } from './network-details/network-details.component';
import { EducationalCoursesComponent } from './educational-courses/educational-courses.component';
import { ServicesAndProductsComponent } from './services-and-products/services-and-products.component';
import { SavingsPlansComponent } from './savings-plans/savings-plans.component';
import { SavingsPlansOneBComponent } from './savings-plans-one-b/savings-plans-one-b.component';
import { PurchaseConfirmationComponent } from './purchase-confirmation/purchase-confirmation.component';

const icons = {
  Search
};


@NgModule({
  declarations: [
    RequestWalletComponent,
    BillingPurchaseComponent,
    BillingOrdersComponent,
    NetworkComponent,
    ProcurementEcopoolComponent,
    CommissionsComponent,
    WalletComponent,
    NetworkComponent,
    InducementsComponent,
    CommissionsBalanceComponent,
    AddressesComponent,
    CartComponent,
    ProductsComponent,
    EditUserComponent,
    ConfigureWalletComponent,
    CreateAddressModalComponent,
    AcademyComponent,
    FundingAccountsComponent,
    NetworkDetailsComponent,
    EducationalCoursesComponent,
    ServicesAndProductsComponent,
    SavingsPlansComponent,
    SavingsPlansOneBComponent,
    PurchaseConfirmationComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ClientRoutingModule,
    MyProfileModule,
    NgxDropzoneModule,
    HomeModule,
    TranslateModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    FeatherModule.pick(icons),
    NgxDatatableModule,
    PerfectScrollbarModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxGaugeModule,
    QrcodeModule,
    BillingPurchasesModule,
    RequestsModule,
    ClientUnilevelTreeModule,
    SharedModule,
    TicketsModule
  ],
  exports: [
    ConfigureWalletComponent
  ],
})
export class ClientModule { }
