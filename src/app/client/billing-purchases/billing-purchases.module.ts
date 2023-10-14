import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TranslateModule } from '@ngx-translate/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { FeatherModule } from 'angular-feather';
import { Search } from 'angular-feather/icons';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxGaugeModule } from 'ngx-gauge';
import { BillingPurchasesComponent } from './billing-purchases.component';
import { BillingPurchasesDetailModalComponent } from './billing-purchases-detail-modal/billing-purchases-detail-modal.component';

const icons = {
  Search
};

@NgModule({
  declarations: [BillingPurchasesComponent, BillingPurchasesDetailModalComponent],
  imports: [
    CommonModule,
    NgbModule,
    NgxDropzoneModule,
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
  ]
})
export class BillingPurchasesModule { }
