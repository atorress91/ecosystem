import { NgModule } from '@angular/core';
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
import { BalanceOfWalletComponent } from './Balance-of-wallet/balance-of-wallet.component';
import { WalletRemovalComponent } from './wallet-removal/wallet-removal.component';
import { TransactionsCommissionComponent } from './transactions-commission/transactions-commission.component';
import { WalletParametersComponent } from './wallet-parameters/wallet-parameters.component';
import { ResultsEcopoolComponent } from './results-ecopool/results-ecopool.component';
import { AuthorizeReturnsComponent } from './authorize-returns/authorize-returns.component';
import { WalkwaysBenchesComponent } from './walkways-benches/walkways-benches.component';
import { WireTransferListComponent } from './wire-transfer-list/wire-transfer-list.component';
import { EducationalProgramsControlComponent } from './educational-programs-control/educational-programs-control.component';
import { ChangeModelComponent } from './change-model/change-model.component';
import { WalletRefillComponent } from './wallet-refill/wallet-refill.component';
import { AuthGuardAdmin } from '@app/core/guard/auth.guard.admin';
import { MaintenanceGuard } from '@app/core/guard/maintenance.guard';
import {TicketViewAdminComponent} from '@app/admin//tickets/tick-view/ticket-view-admin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'home-admin',
    component: HomeAdminComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'affiliates-list',
    component: AffiliatesListComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'calculate-commissions',
    component: CalculateCommissionsComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'compensations-plans-configuration',
    component: CompensationPlansComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'general-reports',
    component: GeneralReportsComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'virtual-wallet',
    component: VirtualWalletComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'import',
    component: ImportComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'news-admin',
    component: NewsAdminComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'products-and-services',
    component: ProductsAndServicesComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'purchases-list',
    component: PurchasesListComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'tickets-for-admin',
    component: TicketsAdminComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'users-list',
    component: UsersListComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'rol-list',
    component: RolListComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'authorize-affiliates',
    component: AuthorizeAffiliatesComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'purchase-order-list',
    component: PurchaseOrderListComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'authorize-purchases',
    component: AuthorizePurchasesComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'closure-concepts',
    component: ClosureConceptsComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'period-closing',
    component: PeriodClosingComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'calculated-commissions',
    component: CalculatedCommissionsComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'accredited-commissions',
    component: AccreditedCommissionsComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'commissions-paid',
    component: CommissionsPaidComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'incentives-delivered',
    component: IncentivesDeliveredComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'incentives-for-delivering',
    component: IncentivesForDeliveringComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'my-profile',
    component: MyProfileComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'unilevel-tree/:id',
    component: PageUnilevelTreeComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'force-genealogical-tree',
    component: PageForceGenealogicalTreeComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'binary-genealogical-tree/:id',
    component: PageBinaryGenealogicalTreeComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'arrays-configurations',
    component: ArraysConfigurationsComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'concept-list',
    component: ConceptListComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'califications-list',
    component: CalificationsListComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'incentives-list',
    component: IncentivesListComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'calculation-groups',
    component: CalculationGroupsComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'attributes',
    component: AttributesListComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'passive-pack',
    component: PassivePackComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'products-services-configuration',
    component: ProductsServicesConfigurationsComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'balance-of-wallet',
    component: BalanceOfWalletComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'wallet-refill',
    component: WalletRefillComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'wallet-removal',
    component: WalletRemovalComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'transactions-commission',
    component: TransactionsCommissionComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'wallet-parameters',
    component: WalletParametersComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'results-ecopool',
    component: ResultsEcopoolComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'authorize-returns',
    component: AuthorizeReturnsComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'walkways-benches',
    component: WalkwaysBenchesComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'wire-transfer-list',
    component: WireTransferListComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'educational-programs-control',
    component: EducationalProgramsControlComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'change-model',
    component: ChangeModelComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  },
  {
    path: 'ticket-for-admin/message',
    component:TicketViewAdminComponent,
    canActivate: [AuthGuardAdmin, MaintenanceGuard],
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
