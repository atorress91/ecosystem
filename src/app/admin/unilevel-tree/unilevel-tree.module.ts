import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { UnilevelTreeComponentComponent } from './unilevel-tree-component/unilevel-tree-component.component';
import { PageUnilevelTreeComponent } from './page/page-unilevel-tree.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [UnilevelTreeComponentComponent, PageUnilevelTreeComponent],
  imports: [CommonModule, PerfectScrollbarModule, NgbModule, TranslateModule, NgbPopoverModule, NgxSpinnerModule],
})
export class UnilevelTreeModule {}
