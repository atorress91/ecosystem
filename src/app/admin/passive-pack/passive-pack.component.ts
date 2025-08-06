import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PaginationRequest } from '@app/core/interfaces/pagination-request';
import { Invoice } from '@app/core/models/invoice-model/invoice.model';
import { InvoiceService } from '@app/core/service/invoice-service/invoice.service';
import { map } from 'rxjs';

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
  totalElements: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  startDate: string = null;
  endDate: string = null;
  @ViewChild('table') table: DatatableComponent;

  constructor(
    private modalService: NgbModal,
    private invoiceService: InvoiceService
  ) {}

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
    const request: PaginationRequest = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      startDate: this.startDate ? new Date(this.startDate) : null,
      endDate: this.endDate ? new Date(this.endDate) : null,
    };
    this.invoiceService
      .getAllInvoices(request)
      .pipe(map((response: any) => response as Invoice[]))
      .subscribe((resp: Invoice[]) => {
        if (resp != null) {
          const data = resp
            .map((invoice) => {
              return invoice.invoicesDetails.map((detail) => {
                return {
                  ...detail,
                  invoiceId: invoice.id,
                  affiliate: invoice.affiliateId,
                  number: invoice.invoiceNumber,
                  status: invoice.status,
                };
              });
            })
            .flat();

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

  openModal(content: any, size: string = 'xl') {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: size,
    });
  }

  passivePackDetailModal(content) {
    this.openModal(content);
  }

  runPassivePackModal(content) {
    this.openModal(content);
  }
}
