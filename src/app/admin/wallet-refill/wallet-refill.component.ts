import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { WalletWait } from '@app/core/models/wallet-wait-model/wallet-wait.model';
import { PrintService } from '@app/core/service/print-service/print.service';
import { WalletWaitService } from '@app/core/service/wallet-wait-service/wallet-wait.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

const header = [
  'Orden',
  'Afiliado',
  'Crédito',
  'Método de pago',
  'Banco',
  'Soporte',
  'Fecha Transacción',
  'Fecha Solicitud',
];

@Component({
  selector: 'app-wallet-refill',
  templateUrl: './wallet-refill.component.html',
})
export class WalletRefillComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  @ViewChild('table') table: DatatableComponent;

  constructor(
    private walletWaitService: WalletWaitService,
    private clipboardService: ClipboardService,
    private printService: PrintService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadWalletWait();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

  loadWalletWait() {
    this.walletWaitService.getAllWalletsWait().subscribe({
      next: (resp) => {
        this.temp = [...resp];
        this.rows = resp;
        this.loadingIndicator = false;
      },
      error: (err) => {
        this.showError('Error!');
      },
    });
  }

  getRowHeight(row) {
    return row.height;
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  clipBoardCopy() {}

  onPrint() {
    const body = this.temp.map((items: WalletWait) => {
      const data = [
        items.order,
        items.affiliateId,
        items.credit,
        items.paymentMethod,
        items.bank,
        items.support,
        items.depositDate,
        items.date,
      ];
      return data;
    });

    this.printService.print(header, body, 'Recarga de billetera', false);
  }

  processOption() {
    Swal.fire({
      title: 'Excuse me!',
      text: 'Are you sure about this operation? If so, click on the YES I AM SURE button.',
      showCancelButton: true,
      confirmButtonColor: '#8963ff',
      cancelButtonColor: '#fb7823',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        const text = result.value;
      }
    });
  }
}
