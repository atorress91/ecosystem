import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AddressesComponent } from './addresses/addresses.component';
import { BillingOrdersComponent } from './billing-orders/billing-orders.component';
import { BillingPurchaseComponent } from './billing-purchase/billing-purchase.component';
import { BillingPurchasesComponent } from './billing-purchases/billing-purchases.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { CommissionsBalanceComponent } from './commissions-balance/commissions-balance.component';
import { InducementsComponent } from './inducements/inducements.component';
import { NetworkComponent } from './network/network.component';
import { NewsComponent } from './news/news.component';
import { ProcurementEcopoolComponent } from './procurement-ecopool/procurement-ecopool.component';
import { RequestsComponent } from './requests/requests.component';
import { TicketsComponent } from './tickets/tickets.component';
import { WalletComponent } from './wallet/wallet.component';
import { RequestWalletComponent } from './request-wallet/request-wallet.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AuthGuard } from '@app/core/guard/auth.guard';
import { ViewUnilevelTreeComponent } from "@app/client/unilevel-tree/page/view-unilevel-tree.component";
import { AcademyComponent } from './academy/academy.component';
import { FundingAccountsComponent } from './funding-accounts/funding-accounts.component';
import { NetworkDetailsComponent } from './network-details/network-details.component';
import { TicketViewComponent } from './tickets/ticket-view/ticket-view.component';
import { EducationalCoursesComponent } from './educational-courses/educational-courses.component';
import { SavingsPlansComponent } from './savings-plans/savings-plans.component';
import { SavingsPlansOneBComponent } from './savings-plans-one-b/savings-plans-one-b.component';
import { ServicesAndProductsComponent } from './services-and-products/services-and-products.component';
import { PurchaseConfirmationComponent } from './purchase-confirmation/purchase-confirmation.component';
import { MaintenanceGuard } from '@app/core/guard/maintenance.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'addresses',
    component: AddressesComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'billing-orders',
    component: BillingOrdersComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'billing-purchase',
    component: BillingPurchaseComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'billing-purchases',
    component: BillingPurchasesComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'commissions',
    component: CommissionsComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'commissions-balance',
    component: CommissionsBalanceComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'inducements',
    component: InducementsComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'network',
    component: NetworkComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'news',
    component: NewsComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'procurement-ecopool',
    component: ProcurementEcopoolComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'requests',
    component: RequestsComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'my-profile',
    component: MyProfileComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'edit-user',
    component: EditUserComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'tickets',
    component: TicketsComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'tickets/message',
    component: TicketViewComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'wallet',
    component: WalletComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'request-wallet',
    component: RequestWalletComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'trees',
    component: ViewUnilevelTreeComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'academy',
    component: AcademyComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'funding-account',
    component: FundingAccountsComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'network-details',
    component: NetworkDetailsComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'educational-courses',
    component: EducationalCoursesComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'services-and-products',
    component: ServicesAndProductsComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'savings-plans',
    component: SavingsPlansComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'savings-plans-one-b',
    component: SavingsPlansOneBComponent,
    canActivate: [AuthGuard, MaintenanceGuard],
  },
  {
    path: 'purchase-confirmation',
    children: [
      { path: 'parametro1/:parametro1/parametro2/:parametro2', component: PurchaseConfirmationComponent },
      { path: ':parametro1/:parametro2', component: PurchaseConfirmationComponent }
    ],
    canActivate: [AuthGuard],
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule { }
