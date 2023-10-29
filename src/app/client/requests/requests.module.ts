import { RequestsComponent } from './requests.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FeatherModule } from 'angular-feather';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxGaugeModule } from 'ngx-gauge';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';

import { Search } from 'angular-feather/icons';
import { CreateRequestsModalComponent } from './create-requests-modal/create-requests-modal.component';
import {SharedModule} from "@app/shared/shared.module";

const icons = {
  Search,
};

@NgModule({
  declarations: [RequestsComponent, CreateRequestsModalComponent],
    imports: [
        CommonModule,
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
        SharedModule,
    ]
})
export class RequestsModule { }
