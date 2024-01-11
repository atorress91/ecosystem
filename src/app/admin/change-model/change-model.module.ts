import { ChangeModelComponent } from './change-model.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FeatherModule } from 'angular-feather';
import { NgxEchartsModule } from 'ngx-echarts';
import { Search } from 'angular-feather/icons';
import { SplitBalancesModalComponent } from './split-balances-modal/split-balances-modal.component';

const icons = {
  Search,
};
@NgModule({
  declarations: [ChangeModelComponent, SplitBalancesModalComponent],
  imports: [
    CommonModule,
    NgbModule,
    TranslateModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    FeatherModule.pick(icons),
    NgxDatatableModule,
  ]
})
export class ChangeModelModule { }
