import { InvoiceDetail } from './../../core/models/invoice-detail-model/invoice-detail.model';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { Invoice } from '@app/core/models/invoice-model/invoice.model';
import { InvoiceService } from '@app/core/service/invoice-service/invoice.service';

@Component({
  selector: 'app-passive-pack',
  templateUrl: './passive-pack.component.html',
})
export class PassivePackComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private modalService: NgbModal,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.loadInvoiceList();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.table) {
      this.scrollBarHorizontal = window.innerWidth < 1200;
      this.table.recalculate();
      this.table.recalculateColumns();
    }
  }

  loadInvoiceList() {
    this.invoiceService.getAllInvoices().subscribe((resp: Invoice[]) => {
      if (resp != null) {
        const data = resp.map(invoice => {
          return invoice.invoiceDetail.map(detail => {
            return {
              ...detail,
              invoiceId: invoice.id,
              affiliate: invoice.affiliateId,
              number: invoice.invoiceNumber,
              status: invoice.status
            }
          });
        }).flat();

        this.temp = [...data];
        this.rows = data;
        this.loadingIndicator = false;
      }
    });
  }

  getRowHeight(row) {
    return row.height;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.invoiceId.toString().toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  passivePackDetailModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  runPassivePackModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }
}
