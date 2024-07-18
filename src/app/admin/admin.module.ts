import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AdminRoutingModule} from './admin-routing.module';
import {NgxEchartsModule} from 'ngx-echarts';
import {NgApexchartsModule} from 'ng-apexcharts';
import {NgxGaugeModule} from 'ngx-gauge';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {TranslateModule} from '@ngx-translate/core';
import {FeatherModule} from 'angular-feather';
import {Search} from 'angular-feather/icons';
import {ClipboardModule} from '@angular/cdk/clipboard';

import {UserListModule} from '@app/admin/users-list/users-list.module';
import {RolListModule} from '@app/admin/rol-list/rol-list.module';
import {ConceptListModule} from './concept-list/concept-list.module';
import {
  ProductsServicesConfigurationsModule
} from './products-services-configurations/products-services-configurations.module';
import {CalculateCommissionsComponent} from './../admin/calculate-commissions/calculate-commissions.component';
import {VirtualWalletComponent} from './virtual-wallet/virtual-wallet.component';
import {CompensationPlansComponent} from './compensation-plans-configuration/compensation-plans.component';
import {GeneralReportsComponent} from './general-reports/general-reports.component';
import {NewsAdminComponent} from './news/news-admin.component';
import {ImportComponent} from './import/import.component';
import {HomeAdminComponent} from './home/home-admin.component';
import {PurchasesListComponent} from './purchases-list/purchases-list.component';
import {TicketsAdminComponent} from './tickets/tickets-admin.component';
import {PurchaseOrderListComponent} from './purchase-order-list/purchase-order-list.component';
import {AuthorizePurchasesComponent} from './authorize-purchases/authorize-purchases.component';
import {ClosureConceptsComponent} from './closure-concepts/closure-concepts.component';
import {PeriodClosingComponent} from './period-closing/period-closing.component';
import {CalculatedCommissionsComponent} from './calculated-commissions/calculated-commissions.component';
import {AccreditedCommissionsComponent} from './accredited-commissions/accredited-commissions.component';
import {CommissionsPaidComponent} from './commissions-paid/commissions-paid.component';
import {IncentivesDeliveredComponent} from './incentives-delivered/incentives-delivered.component';
import {IncentivesForDeliveringComponent} from './incentives-for-delivering/incentives-for-delivering.component';
import {ArraysConfigurationsComponent} from './arrays-configurations/arrays-configurations.component';

import {ForceGenealogicalTreeModule} from './force-genealogical-tree/force-genealogical-tree.module';
import {UnilevelTreeModule} from './unilevel-tree/unilevel-tree.module';
import {MyProfileModule} from './my-profile/my-profile.module';
import {AffiliatesListModule} from './affiliates-list/affiliates-list.module';
import {BinaryGenealogicalTreeModule} from './binary-genealogical-tree/binary-genealogical-tree.module';
import {IncentivesListModule} from './incentives-list/incentives-list.module';
import {CalificationsListModule} from './califications-list/califications-list.module';
import {CalculationGroupsModule} from './calculation-groups/calculation-groups.module';
import {PassivePackModule} from './passive-pack/passive-pack.module';
import {AttributesListModule} from './attributes-list/attributes-list.module';
import {CategoriesModule} from './categories/categories.module';
import {ProductsAndServicesModule} from './products-and-services/products-and-services.module';
import {BalanceOfWalletComponent} from './Balance-of-wallet/balance-of-wallet.component';
import {WalletRefillComponent} from './wallet-refill/wallet-refill.component';
import {WalletRemovalComponent} from './wallet-removal/wallet-removal.component';
import {TransactionsCommissionComponent} from './transactions-commission/transactions-commission.component';
import {WalletParametersComponent} from './wallet-parameters/wallet-parameters.component';
import {AuthorizeAffiliatesModule} from './authorize-affiliates/authorize-affiliates.module';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {ResultsEcopoolComponent} from './results-ecopool/results-ecopool.component';
import {AuthorizeReturnsComponent} from './authorize-returns/authorize-returns.component';
import {WalkwaysBenchesComponent} from './walkways-benches/walkways-benches.component';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {SettingsComponent} from './settings/settings.component';
import {WireTransferListComponent} from './wire-transfer-list/wire-transfer-list.component';
import {
  EducationalProgramsControlComponent
} from './educational-programs-control/educational-programs-control.component';
import {ChangeModelModule} from './change-model/change-model.module';
import {SharedModule} from "../shared/shared.module";
import {TicketViewAdminComponent} from './tickets/tick-view/ticket-view-admin.component';
import { CreateAdminModalComponent } from './tickets/create-admin-modal/create-admin-modal.component';

const icons = {
  Search,
};

@NgModule({
  declarations: [
    VirtualWalletComponent,
    HomeAdminComponent,
    CompensationPlansComponent,
    GeneralReportsComponent,
    CalculateCommissionsComponent,
    ImportComponent,
    NewsAdminComponent,
    PurchasesListComponent,
    TicketsAdminComponent,
    PurchaseOrderListComponent,
    AuthorizePurchasesComponent,
    ClosureConceptsComponent,
    PeriodClosingComponent,
    CalculatedCommissionsComponent,
    AccreditedCommissionsComponent,
    CommissionsPaidComponent,
    IncentivesDeliveredComponent,
    IncentivesForDeliveringComponent,
    ArraysConfigurationsComponent,
    BalanceOfWalletComponent,
    WalletRefillComponent,
    WalletRemovalComponent,
    TransactionsCommissionComponent,
    WalletParametersComponent,
    ResultsEcopoolComponent,
    AuthorizeReturnsComponent,
    WalkwaysBenchesComponent,
    SettingsComponent,
    WireTransferListComponent,
    EducationalProgramsControlComponent,
    TicketViewAdminComponent,
    CreateAdminModalComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    UserListModule,
    RolListModule,
    AffiliatesListModule,
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AdminRoutingModule,
    TranslateModule,
    MyProfileModule,
    UnilevelTreeModule,
    ForceGenealogicalTreeModule,
    BinaryGenealogicalTreeModule,
    ConceptListModule,
    AuthorizeAffiliatesModule,
    CalculationGroupsModule,
    CalificationsListModule,
    IncentivesListModule,
    ProductsAndServicesModule,
    CategoriesModule,
    AttributesListModule,
    PassivePackModule,
    ProductsServicesConfigurationsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    FeatherModule.pick(icons),
    NgxDatatableModule,
    PerfectScrollbarModule,
    NgApexchartsModule,
    NgxGaugeModule,
    NgxDropzoneModule,
    CKEditorModule,
    ChangeModelModule,
    SharedModule,
    NgOptimizedImage
  ]
})
export class AdminModule {
}
