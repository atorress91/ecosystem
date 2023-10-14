import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { Search } from 'angular-feather/icons';
import { ToastrModule } from 'ngx-toastr';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthorizeAffiliatesComponent } from './authorize-affiliates.component';
import { AuthorizeAffiliatesEditModalComponent } from './authorize-affiliates-edit-modal/authorize-affiliates-edit-modal.component';

const icons = {
  Search,
};

@NgModule({
  declarations: [AuthorizeAffiliatesEditModalComponent, AuthorizeAffiliatesComponent],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ClipboardModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    ToastrModule.forRoot(),
    FeatherModule.pick(icons),
    NgxDatatableModule,
    PerfectScrollbarModule,
  ],
})
export class AuthorizeAffiliatesModule { }
