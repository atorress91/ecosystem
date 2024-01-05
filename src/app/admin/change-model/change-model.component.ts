import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { InvoiceService } from '@app/core/service/invoice-service/invoice.service';
import { InvoiceModelOneTwo } from '@app/core/models/invoice-model/invoice-model-one-two';

@Component({
  selector: 'app-change-model',
  templateUrl: './change-model.component.html',
  styleUrls: ['./change-model.component.css']
})
export class ChangeModelComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  @ViewChild('table') table: DatatableComponent;
  searchField: any;

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.loadAllInvoicesForModelOneAndTwo();
    this.loadingIndicator = false;
  }

  onPrint() {
    throw new Error('Method not implemented.');
  }

  clipBoardCopy() {
    throw new Error('Method not implemented.');
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase().trim();

    const temp = this.temp.filter(d => {
      if (d[this.searchField]) {
        return val === '' || d[this.searchField].toString().toLowerCase() === val;
      }
      return false;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  loadAllInvoicesForModelOneAndTwo() {
    this.invoiceService.getAllInvoicesForModelOneAndTwo().subscribe({
      next: (result: InvoiceModelOneTwo[]) => {
        this.temp = [...result];
        this.rows = result;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }
}
