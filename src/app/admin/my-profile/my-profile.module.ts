import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

import { MyProfileComponent } from './my-profile.component';
import { MyProfileEditPasswordModalComponent } from './my-profile-edit-password-modal/my-profile-edit-password-modal.component';
import { MyProfileEditPersonalInfoModalComponent } from './my-profile-edit-personal-info-modal/my-profile-edit-personal-info-modal.component';
import { MyProfileEditPasswordUploadModalComponent } from './my-profile-edit-password-upload-modal/my-profile-edit-password-upload-modal.component';

const icons = {
  Search,
};

@NgModule({
  declarations: [MyProfileComponent, MyProfileEditPasswordModalComponent, MyProfileEditPersonalInfoModalComponent, MyProfileEditPasswordUploadModalComponent],
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
export class MyProfileModule {}
