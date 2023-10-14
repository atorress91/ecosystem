
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { Search } from 'angular-feather/icons';
import { ToastrModule } from 'ngx-toastr';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UsersListComponent } from './users-list.component';

//Modals
import { UsersListCreateModalComponent } from './users-list-create-modal/users-list-create-modal.component';
import { UsersListEditModalComponent } from './users-list-edit-modal/users-list-edit-modal.component';
import { UsersListDetailModalComponent } from './users-list-detail-modal/users-list-detail-modal.component';

const icons = {
  Search,
};

@NgModule({
  declarations: [
    UsersListCreateModalComponent,
    UsersListEditModalComponent,
    UsersListDetailModalComponent,
    UsersListComponent,
  ],
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
  ]
})
export class UserListModule { }
