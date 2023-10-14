import { WalletRefillComponent } from './wallet-refill/wallet-refill.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AffiliatesListComponent } from './affiliates-list/affiliates-list.component';
import { CalculateCommissionsComponent } from './../admin/calculate-commissions/calculate-commissions.component';
import { VirtualWalletComponent } from './virtual-wallet/virtual-wallet.component';
import { CompensationPlansComponent } from './compensation-plans-configuration/compensation-plans.component';
import { GeneralReportsComponent } from './general-reports/general-reports.component';
import { ImportComponent } from './import/import.component';
import { HomeAdminComponent } from './home/home-admin.component';
import { ProductsAndServicesComponent } from './products-and-services/products-and-services.component';
import { NewsAdminComponent } from './news/news-admin.component';
import { PurchasesListComponent } from './purchases-list/purchases-list.component';
import { SettingsComponent } from './settings/settings.component';
import { TicketsAdminComponent } from './tickets/tickets-admin.component';
import { UsersListComponent } from './users-list/users-list.component';
import { RolListComponent } from './rol-list/rol-list.component';
import { AuthorizeAffiliatesComponent } from './authorize-affiliates/authorize-affiliates.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { AuthorizePurchasesComponent } from './authorize-purchases/authorize-purchases.component';
import { ClosureConceptsComponent } from './closure-concepts/closure-concepts.component';
import { PeriodClosingComponent } from './period-closing/period-closing.component';
import { CalculatedCommissionsComponent } from './calculated-commissions/calculated-commissions.component';
import { AccreditedCommissionsComponent } from './accredited-commissions/accredited-commissions.component';
import { CommissionsPaidComponent } from './commissions-paid/commissions-paid.component';
import { IncentivesDeliveredComponent } from './incentives-delivered/incentives-delivered.component';
import { IncentivesForDeliveringComponent } from './incentives-for-delivering/incentives-for-delivering.component';
import { PageUnilevelTreeComponent } from './unilevel-tree/page/page-unilevel-tree.component';
import { PageForceGenealogicalTreeComponent } from './force-genealogical-tree/page/page-force-genealogical-tree.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { PageBinaryGenealogicalTreeComponent } from './binary-genealogical-tree/page/page-binary-genealogical-tree.component';
import { CalculationGroupsComponent } from './calculation-groups/calculation-groups.component';
import { IncentivesListComponent } from './incentives-list/incentives-list.component';
import { CalificationsListComponent } from './califications-list/califications-list.component';
import { ConceptListComponent } from './concept-list/concept-list.component';
import { ArraysConfigurationsComponent } from './arrays-configurations/arrays-configurations.component';
import { CategoriesComponent } from './categories/categories.component';
import { AttributesListComponent } from './attributes-list/attributes-list.component';
import { PassivePackComponent } from './passive-pack/passive-pack.component';
import { ProductsServicesConfigurationsComponent } from './products-services-configurations/products-services-configurations.component';
import { BalanceOfWalletComponent } from './balance-of-wallet/balance-of-wallet.component';
import { WalletRemovalComponent } from './wallet-removal/wallet-removal.component';
import { TransactionsCommissionComponent } from './transactions-commission/transactions-commission.component';
import { WalletParametersComponent } from './wallet-parameters/wallet-parameters.component';
import { ResultsEcopoolComponent } from './results-ecopool/results-ecopool.component';
import { AuthorizeReturnsComponent } from './authorize-returns/authorize-returns.component';
import { WalkwaysBenchesComponent } from './walkways-benches/walkways-benches.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'home-admin',
    component: HomeAdminComponent,
  },
  {
    path: 'affiliates-list',
    component: AffiliatesListComponent,
  },
  {
    path: 'calculate-commissions',
    component: CalculateCommissionsComponent,
  },
  {
    path: 'compensations-plans-configuration',
    component: CompensationPlansComponent,
  },
  {
    path: 'general-reports',
    component: GeneralReportsComponent,
  },
  {
    path: 'virtual-wallet',
    component: VirtualWalletComponent,
  },
  {
    path: 'import',
    component: ImportComponent,
  },
  {
    path: 'news-admin',
    component: NewsAdminComponent,
  },
  {
    path: 'products-and-services',
    component: ProductsAndServicesComponent,
  },
  {
    path: 'purchases-list',
    component: PurchasesListComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'tickets-admin',
    component: TicketsAdminComponent,
  },
  {
    path: 'users-list',
    component: UsersListComponent,
  },
  {
    path: 'rol-list',
    component: RolListComponent,
  },
  {
    path: 'authorize-affiliates',
    component: AuthorizeAffiliatesComponent,
  },
  {
    path: 'purchase-order-list',
    component: PurchaseOrderListComponent,
  },
  {
    path: 'authorize-purchases',
    component: AuthorizePurchasesComponent,
  },
  {
    path: 'closure-concepts',
    component: ClosureConceptsComponent,
  },
  {
    path: 'period-closing',
    component: PeriodClosingComponent,
  },
  {
    path: 'calculated-commissions',
    component: CalculatedCommissionsComponent,
  },
  {
    path: 'accredited-commissions',
    component: AccreditedCommissionsComponent,
  },
  {
    path: 'commissions-paid',
    component: CommissionsPaidComponent,
  },
  {
    path: 'incentives-delivered',
    component: IncentivesDeliveredComponent,
  },
  {
    path: 'incentives-for-delivering',
    component: IncentivesForDeliveringComponent,
  },
  {
    path: 'my-profile',
    component: MyProfileComponent,
  },
  {
    path: 'unilevel-tree/:id',
    component: PageUnilevelTreeComponent,
  },
  {
    path: 'force-genealogical-tree',
    component: PageForceGenealogicalTreeComponent,
  },
  {
    path: 'binary-genealogical-tree/:id',
    component: PageBinaryGenealogicalTreeComponent,
  },
  {
    path: 'arrays-configurations',
    component: ArraysConfigurationsComponent,
  },
  {
    path: 'concept-list',
    component: ConceptListComponent,
  },
  {
    path: 'califications-list',
    component: CalificationsListComponent,
  },
  {
    path: 'incentives-list',
    component: IncentivesListComponent,
  },
  {
    path: 'calculation-groups',
    component: CalculationGroupsComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'attributes',
    component: AttributesListComponent,
  },
  {
    path: 'passive-pack',
    component: PassivePackComponent,
  },
  {
    path: 'products-services-configuration',
    component: ProductsServicesConfigurationsComponent,
  },
  {
    path: 'balance-of-wallet',
    component: BalanceOfWalletComponent,
  },
  {
    path: 'wallet-refill',
    component: WalletRefillComponent,
  },
  {
    path: 'wallet-removal',
    component: WalletRemovalComponent,
  },
  {
    path: 'transactions-commission',
    component: TransactionsCommissionComponent,
  },
  {
    path: 'wallet-parameters',
    component: WalletParametersComponent,
  },
  {
    path: 'results-ecopool',
    component: ResultsEcopoolComponent
  },
  {
    path: 'authorize-returns',
    component: AuthorizeReturnsComponent
  },
  {
    path: 'walkways-benches',
    component: WalkwaysBenchesComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
