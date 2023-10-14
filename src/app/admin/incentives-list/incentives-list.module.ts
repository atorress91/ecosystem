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

import { IncentivesListCreateModalComponent } from './incentives-list-create-modal/incentives-list-create-modal.component';
import { IncentivesListComponent } from './incentives-list.component';
import { IncentivesListEditModalComponent } from './incentives-list-edit-modal/incentives-list-edit-modal.component';
import { IncentivesListDetailsModalComponent } from './incentives-list-details-modal/incentives-list-details-modal.component';

const icons = {
  Search,
};

@NgModule({
  declarations: [IncentivesListComponent, IncentivesListCreateModalComponent, IncentivesListEditModalComponent, IncentivesListDetailsModalComponent],
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
  ],
})
export class IncentivesListModule {}
