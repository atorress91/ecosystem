import { NgModule } from '@angular/core';
import { Search } from 'angular-feather/icons';
import {CommonModule, NgOptimizedImage} from '@angular/common';
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

import { CreateTicketModalComponent } from './create-ticket-modal/create-ticket-modal.component';
import { TicketsComponent } from './tickets.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TicketViewComponent } from './ticket-view/ticket-view.component';
import { ClientRoutingModule } from '../client-routing.module';

const icons = {
  Search,
};

@NgModule({
  declarations: [
    CreateTicketModalComponent,
    TicketsComponent,
    TicketViewComponent
  ],
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
        CKEditorModule,
        NgxDropzoneModule,
        ClientRoutingModule,
        NgOptimizedImage,
    ]
})
export class TicketsModule { }
