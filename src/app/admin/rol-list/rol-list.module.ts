import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
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

import { RolListComponent } from './rol-list.component';
import { RolListEditModalComponent } from './rol-list-edit-modal/rol-list-edit-modal.component';
import { RolListCreateModalComponent } from './rol-list-create-modal/rol-list-create-modal.component';
import { RolListPermissionsModalComponent } from './rol-list-permissions-modal/rol-list-permissions-modal.component';
import { RolListSummaryModalComponent } from './rol-list-summary-modal/rol-list-summary-modal.component';

const icons = {
  Search,
};

@NgModule({
  declarations: [
    RolListEditModalComponent,
    RolListComponent,
    RolListCreateModalComponent,
    RolListPermissionsModalComponent,
    RolListSummaryModalComponent,
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
  ],
})
export class RolListModule {}
