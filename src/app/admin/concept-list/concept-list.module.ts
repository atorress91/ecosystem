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

import { ConceptListCreateModalComponent } from './concept-list-create-modal/concept-list-create-modal.component';
import { ConceptListComponent } from './concept-list.component';
import { ConceptListEditModalComponent } from './concept-list-edit-modal/concept-list-edit-modal.component';
import { ConceptListDetailsModalComponent } from './concept-list-details-modal/concept-list-details-modal.component';
import { ConceptListBinaryConfigurationModalComponent } from './concept-list-binary-configuration-modal/concept-list-binary-configuration-modal.component';
import { ConceptListConfigurationModalComponent } from './concept-list-configuration-modal/concept-list-configuration-modal.component';


const icons = {
  Search,
};

@NgModule({
  declarations: [ConceptListComponent, ConceptListCreateModalComponent, ConceptListEditModalComponent, ConceptListDetailsModalComponent, ConceptListBinaryConfigurationModalComponent, ConceptListConfigurationModalComponent],
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
export class ConceptListModule {}
