import { Component, ViewChild, HostListener } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';

import { PrintService } from '@app/core/service/print-service/print.service';
const header = [
  'Afiliado',
  'Nombre y Apellido',
  'No. Factura',
  'Fecha',
  'Estado Factura',
  'Pagado'
];
@Component({
  selector: 'app-purchases-list',
  templateUrl: './purchases-list.component.html',
  providers: [ToastrService],
})
export class PurchasesListComponent {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor(private toastr: ToastrService, private clipboardService: ClipboardService,private printService:PrintService) {
    this.fetch((data) => {
      this.temp = [...data];
      this.rows = data;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 500);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

  getRowHeight(row) {
    return row.height;
  }
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/admin/purchases-list-data.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  clipBoardCopy() {
    var string = JSON.stringify(this.temp);
    var result = this.clipboardService.copyFromContent(string);

    if (this.temp.length === 0) {
      this.toastr.info('no data to copy');
    } else {
      this.toastr.success('copied ' + this.temp.length + ' rows successfully');
    }
  }

  onPrint() {
    const body = this.temp.map((items: any) => {
      const data = [
        items.affiliate,
        items.nameAndLastName,
        items.noBill,
        items.date,
        items.billState,
        items.paid
      ];
      return data;
    });

    this.printService.print(
      header,
      body,
      'Lista de Compras',
      false
    );
  }
}
