import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { Wallet } from '@app/core/models/wallet-model/wallet.model';
import { PrintService } from '@app/core/service/print-service/print.service';
import { WalletService } from '@app/core/service/wallet-service/wallet.service';
import { ToastrService } from 'ngx-toastr';

const header = [
  'Usuario Responsable',
  'Afiliado',
  'Crédito',
  'Débito',
  'Estado',
  'Concepto',
  'Fecha',
];

@Component({
  selector: 'app-balance-of-wallet',
  templateUrl: './balance-of-wallet.component.html',
})
export class BalanceOfWalletComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private walletService: WalletService,
    private printService: PrintService,
    private clipboardService: ClipboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadWalletBalance();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

  loadWalletBalance() {
    this.walletService.getAllWallets().subscribe((resp) => {
      if (resp != null) {
        this.temp = [...resp];
        this.rows = resp;
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
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
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
    const body = this.temp.map((items: Wallet) => {
      const data = [
        items.affiliateId,
        items.userId,
        items.credit,
        items.debit,
        items.status == true ? 'Atendido' : 'No atendido',
        items.concept,
        items.date,
      ];
      return data;
    });

    this.printService.print(header, body, 'Balance de Billetera', false);
  }
}
