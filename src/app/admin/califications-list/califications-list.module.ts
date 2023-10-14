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

import { CalificationsListComponent } from './califications-list.component';
import { CalificationsListCreateModalComponent } from './califications-list-create-modal/califications-list-create-modal.component';
import { CalificationsListEditModalComponent } from './califications-list-edit-modal/califications-list-edit-modal.component';
import { CalificationsListDetailsModalComponent } from './califications-list-details-modal/califications-list-details-modal.component';

const icons = {
  Search,
};

@NgModule({
  declarations: [CalificationsListComponent, CalificationsListCreateModalComponent, CalificationsListEditModalComponent, CalificationsListDetailsModalComponent],
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
export class CalificationsListModule {}
