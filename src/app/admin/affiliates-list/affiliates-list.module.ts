import { AffiliatesListComponent } from './affiliates-list.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { Search } from 'angular-feather/icons';
import { ToastrModule } from 'ngx-toastr';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AffiliatesListEditModalComponent } from './affiliates-list-edit-modal/affiliates-list-edit-modal.component';
import { MakePurchaseModalComponent } from './make-purchase-modal/make-purchase-modal.component';
import { BalanceInformationModalComponent } from './balance-information-modal/balance-information-modal.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';


const icons = {
  Search,
};
@NgModule({
  declarations: [AffiliatesListEditModalComponent, AffiliatesListComponent, MakePurchaseModalComponent, BalanceInformationModalComponent],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ClipboardModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    ToastrModule.forRoot(),
    FeatherModule.pick(icons),
    NgxDatatableModule,
    PerfectScrollbarModule,
    SharedModule,
    NgApexchartsModule,
  ],
})
export class AffiliatesListModule { }
