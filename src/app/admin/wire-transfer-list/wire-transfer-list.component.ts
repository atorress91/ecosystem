import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { PaymentTransaction } from '@app/core/models/payment-transaction-model/payment-transaction-request.model';
import { PaymentTransactionService } from '@app/core/service/payment-transaction-service/payment-transaction.service';
import { ConfirmPaymentTransaction } from '@app/core/models/payment-transaction-model/confirm-payment-transaction';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wire-transfer-list',
  templateUrl: './wire-transfer-list.component.html'
})
export class WireTransferListComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  @ViewChild('table') table: DatatableComponent;
  constructor(private paymentTransactionService: PaymentTransactionService, private toast: ToastrService) { }

  ngOnInit() {
    this.loadAllWireTransactions();
  }

  showSuccess(message: string) {
    this.toast.success(message);
  }

  showError(message: string) {
    this.toast.error(message);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.userName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  loadAllWireTransactions() {
    this.paymentTransactionService.getAllWireTransactions().subscribe((data: PaymentTransaction[]) => {
      this.rows = data;
      this.temp = [...data];
      this.loadingIndicator = false;
    });
  }

  confirmPaymentTransaction(row) {
    Swal.fire({
      title: 'Confirmar pago',
      text: '¿Estás seguro de realizar el pago?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let payment = new ConfirmPaymentTransaction();

        payment.id = row.id;
        payment.userName = row.userName;

        this.paymentTransactionService.confirmPayment(payment).subscribe({
          next: (value) => {
            this.showSuccess('Pago confirmado');
            this.loadAllWireTransactions();
          },
          error: (err) => {
            this.showError(err);
          },
        });
      }
    });
  }

}
