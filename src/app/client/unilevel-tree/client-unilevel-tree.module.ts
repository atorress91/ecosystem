import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ClientUnilevelTreeComponentComponent } from './unilevel-tree-component/client-unilevel-tree-component.component';
import { ViewUnilevelTreeComponent } from './page/view-unilevel-tree.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgxDropzoneModule} from "ngx-dropzone";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";

@NgModule({
  declarations: [ClientUnilevelTreeComponentComponent, ViewUnilevelTreeComponent],
  imports: [CommonModule, PerfectScrollbarModule, NgbModule, TranslateModule, NgbPopoverModule, NgxSpinnerModule, NgxDropzoneModule, ReactiveFormsModule, NgxDatatableModule, NgOptimizedImage],
})
export class ClientUnilevelTreeModule {}
