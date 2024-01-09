import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { InvoiceService } from '@app/core/service/invoice-service/invoice.service';
import { InvoiceModelOneTwo } from '@app/core/models/invoice-model/invoice-model-one-two';
import { SplitBalancesModalComponent } from './split-balances-modal/split-balances-modal.component';

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
  @ViewChild(SplitBalancesModalComponent) private modalComponent: SplitBalancesModalComponent;

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.loadAllInvoicesForModelOneAndTwo();
    this.loadingIndicator = false;
  }

  openModal() {
    if (this.modalComponent) {
      this.modalComponent.initModal();
    }
  }

  onPrint() {
    throw new Error('Method not implemented.');
  }

  clipBoardCopy() {
    throw new Error('Method not implemented.');
  }

  updateFilter(event) {
    let val = event.target.value.toLowerCase().trim();

    const modelMap = {
      'modelo 2': '2',
      'modelo 1a': '7',
      'modelo 1b': '8'
    };

    val = modelMap[val] || val;

    const temp = this.temp.filter(d => {
      if (d[this.searchField]) {
        const fieldValue = d[this.searchField].toString().toLowerCase();
        return val === '' || fieldValue === val || fieldValue === modelMap[fieldValue];
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
