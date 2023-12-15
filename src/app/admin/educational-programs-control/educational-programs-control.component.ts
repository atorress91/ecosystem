import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from '@app/core/service/invoice-service/invoice.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-educational-programs-control',
  templateUrl: './educational-programs-control.component.html',
  styleUrls: ['./educational-programs-control.component.css']
})
export class EducationalProgramsControlComponent implements OnInit {
  rows = [];
  temp = [];
  properties: any = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  searchField: any;

  @ViewChild('table') table: DatatableComponent;

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.getAllTradingAcademyPurchases();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(d => {
      if (d[this.searchField]) {
        return d[this.searchField].toString().toLowerCase().indexOf(val) !== -1;
      }
      return false;
    });

    this.rows = temp;
    this.table.offset = 0;
  }


  onPrint() {
    throw new Error('Method not implemented.');
  }

  clipBoardCopy() {
    throw new Error('Method not implemented.');
  }

  getAllTradingAcademyPurchases() {
    this.invoiceService.getAllInvoicesForTradingAcademyPurchases().subscribe({
      next: (response) => {
        console.log(response);
        this.rows = response;
        this.temp = [...response];
        this.loadingIndicator = false;
        this.properties = Object.getOwnPropertyNames(this.rows[0]);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
