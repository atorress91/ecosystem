import { CoinpaycrComponent } from './coinpaycr/coinpaycr.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { Search } from 'angular-feather/icons';
import { ToastrModule } from 'ngx-toastr';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { QrcodeModule } from 'qrcode-angular';
import { ThirdPartyPaymentsComponent } from './third-party-payments/third-party-payments.component';
import { MembershipManagerComponent } from './membership-manager.component';
import { CoinpaymentsComponent } from './coinpayments/coinpayments.component';

const icons = {
  Search,
};

@NgModule({
  declarations: [
    ThirdPartyPaymentsComponent,
    MembershipManagerComponent,
    CoinpaycrComponent,
    CoinpaymentsComponent,
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    NgbModule,
    FormsModule,
    ClipboardModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    ToastrModule.forRoot(),
    FeatherModule.pick(icons),
    NgxDatatableModule,
    PerfectScrollbarModule,
    NgApexchartsModule,
    NgxGaugeModule,
    QrcodeModule,
  ],
  exports: [MembershipManagerComponent],
})
export class MembershipManagerModule {}
