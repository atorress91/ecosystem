import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ClipboardService } from 'ngx-clipboard';

import { PrintService } from '@app/core/service/print-service/print.service';

@Component({
  selector:'app-news-admin',
  templateUrl:'./walkways-benches.component.html'
})
export class WalkwaysBenchesComponent {
  rows = [];
  loadingIndicator = true;
  active = 1;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  @ViewChild('table') table: DatatableComponent;


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

}
