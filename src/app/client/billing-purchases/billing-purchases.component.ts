import { WalletRequestRevertTransaction } from './../../core/models/wallet-request-request-model/wallet-request-revert-transaction.model';
import { Subject, Subscription, takeUntil } from 'rxjs';
import {
  Component,
  ViewChild,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';

import { InvoiceService } from '@app/core/service/invoice-service/invoice.service';
import { ToastrService } from 'ngx-toastr';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { Invoice } from '@app/core/models/invoice-model/invoice.model';
import { PrintService } from '@app/core/service/print-service/print.service';
import { WalletRequestService } from '@app/core/service/wallet-request/wallet-request.service';
import { ConfigurationService } from '@app/core/service/configuration-service/configuration.service';
import { WalletWithdrawalsConfiguration } from '@app/core/models/wallet-withdrawals-configuration-model/wallet-withdrawals-configuration.model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter',
  templateUrl: './billing-purchases.component.html',
})
export class BillingPurchasesComponent implements OnInit, OnDestroy {
  private user: UserAffiliate = new UserAffiliate();
  private suscription: Subscription;
  private destroy$ = new Subject();
  private walletRequestRevertTransaction: WalletRequestRevertTransaction = new WalletRequestRevertTransaction();
  withdrawalConfiguration = new WalletWithdrawalsConfiguration();
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private auth: AuthService,
    private printService: PrintService,
    private walletRequestService: WalletRequestService,
    private configurationService: ConfigurationService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.suscription = this.auth.currentUserAffiliate
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
      });
    this.loadBillingPurchases();
    this.loadWithdrawalConfiguration();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.suscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  loadWithdrawalConfiguration() {
    this.configurationService.getWithdrawalsWalletConfiguration().subscribe({
      next: (value) => {
        this.withdrawalConfiguration.activate_invoice_cancellation = value.activate_invoice_cancellation;
      },
      error: (err) => {
        this.showError('Error');
      },
    })
  }

  loadBillingPurchases() {
    this.invoiceService.getAllInvoicesUser(this.user.id).subscribe({
      next: (invoices: Invoice[]) => {
        this.temp = [...invoices];
        this.rows = invoices;
        this.loadingIndicator = false;
      },
      error: (err) => {
        this.showError('Error');
      },
    });
  }

  getRowHeight(row) {
    return row.height;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      const invoiceNumberStr = d.id.toString();
      return invoiceNumberStr.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  onPrintInvoice(invoice: Invoice) {
    this.invoiceService.createInvoice(invoice.id).subscribe({
      next: (blob: Blob) => {
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `invoice_${invoice.id}.pdf`;

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.log(err);
        this.showError('Error downloading the invoice. Please try again.');
      },
    });
  }

  showConfirmationRequest(row) {
    let reason;

    this.askForReason()
      .then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.close();
          return;
        }

        if (!result.value) {
          this.askForReason();
          return;
        }

        reason = result.value;
        return this.confirmRequest(result.value, row);
      })
      .then((result) => {
        if (result && result.isConfirmed) {
          this.setRequestRevertTransaction(row, reason);
          this.createRequestRevertDebitTransaction();
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      });
  }

  askForReason() {
    return Swal.fire({
      title: 'Ingrese un motivo para anular la factura',
      input: 'text',
      inputPlaceholder: 'motivo',
      showCancelButton: true,
      confirmButtonText: 'Solicitar',
      cancelButtonText: 'Cancelar',
    });
  }

  confirmRequest(reason, row) {
    return Swal.fire({
      title: '¿Está seguro que desea realizar la solicitud?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });
  }

  setRequestRevertTransaction(row, reason): WalletRequestRevertTransaction {
    this.walletRequestRevertTransaction.affiliateId = row.affiliateId;
    this.walletRequestRevertTransaction.concept = reason;
    this.walletRequestRevertTransaction.invoiceId = row.id;

    return this.walletRequestRevertTransaction;
  }

  createRequestRevertDebitTransaction() {
    this.walletRequestService.createWalletRequestRevertDebitTransaction(this.walletRequestRevertTransaction).subscribe({
      next: (value) => {
        this.showSuccess('La solicitud fue creada correctamente');
      },
      error: (err) => {
        this.showError('Error');
      },
    });
  }

  downloadPDF() {
    const DATA = document.getElementById('htmlTable');

    html2canvas(DATA).then(canvas => {
      let pdf = new jsPDF('l', 'mm', 'a4');

      const pageWidth = 297;
      const imgWidth = pageWidth - 40;

      const imgHeight = canvas.height * imgWidth / canvas.width;

      const posX = 20;
      const posY = 30;

      pdf.setFontSize(18);
      pdf.text('Lista de compras', pageWidth / 2, 20, { align: 'center' });

      const contentDataURL = canvas.toDataURL('image/png');
      pdf.addImage(contentDataURL, 'PNG', posX, posY, imgWidth, imgHeight);
      pdf.save('documento.pdf');
    });
  }

  copyTableData() {
    const rows = this.table._internalRows;
    if (rows && rows.length) {
      const headers = [
        this.translateService.instant('BILLING-PURCHASES-PAGE.ROW-NO-BILL.TEXT'),
        this.translateService.instant('BILLING-PURCHASES-PAGE.ROW-DATE.TEXT'),
        this.translateService.instant('BILLING-PURCHASES-PAGE.ROW-BILL-STATE.TEXT'),
        this.translateService.instant('BILLING-PURCHASES-PAGE.ROW-PAID.TEXT'),
        this.translateService.instant('BILLING-PURCHASES-PAGE.ROW-DETAIL.TEXT')
      ];

      const data = rows.map(row => [
        row.id,
        row.date,
        row.status ? 'Activa' : 'Cancelada',
        row.state ? 'Pagado' : 'No pagado',
        '...'
      ]);

      const tableText = [headers, ...data].map(row => row.join('\t')).join('\n');
      this.copyTextToClipboard(tableText);
    }
  }

  copyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.toastr.success('Se ha copiado al portapapeles')
    } catch (err) {
      console.error('Error: ', err);
    }

    document.body.removeChild(textArea);
  }

  isEligibleForCancellation(row): boolean {
    return row.invoiceDetail.some(detail => detail.paymentGroupId === 2);
  }
}
