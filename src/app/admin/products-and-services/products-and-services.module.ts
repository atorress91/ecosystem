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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { ProductsAndServicesComponent } from './products-and-services.component';
import { ProductsAndServicesCreateModalComponent } from './products-and-services-create-modal/products-and-services-create-modal.component';
import { ProductsAndServicesMovementsModalComponent } from './products-and-services-movements-modal/products-and-services-movements-modal.component';
import { ProductsAndServicesEditModalComponent } from './products-and-services-edit-modal/products-and-services-edit-modal.component';
import { NgxDropzoneModule } from 'ngx-dropzone';


const icons = {
  Search,
};
@NgModule({
  declarations: [
    ProductsAndServicesComponent,
    ProductsAndServicesCreateModalComponent,
    ProductsAndServicesMovementsModalComponent,
    ProductsAndServicesEditModalComponent,
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
    CKEditorModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    ToastrModule.forRoot(),
    FeatherModule.pick(icons),
    NgxDatatableModule,
    PerfectScrollbarModule,
    NgApexchartsModule,
    NgxGaugeModule,
    NgxDropzoneModule,
  ],
})
export class ProductsAndServicesModule {}
