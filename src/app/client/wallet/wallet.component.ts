import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { BalanceInformation } from './../../core/models/wallet-model/balance-information.model';
import { UserAffiliate } from './../../core/models/user-affiliate-model/user.affiliate.model';
import { WalletService } from '@app/core/service/wallet-service/wallet.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AuthService } from '@app/core/service/authentication-service/auth.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
})
export class WalletComponent implements OnInit {
  private subscription: Subscription;
  balanceInformation: BalanceInformation = new BalanceInformation();
  public userCookie: UserAffiliate;
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  @ViewChild('table') table: DatatableComponent;

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.subscription = this.authService.currentUserAffiliate.subscribe(
      (user) => {
        this.userCookie = user;
        if (user) {
          this.loadBalanceInformation();
        }
      }
    );
    this.loadWalletList()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

  loadWalletList() {
    this.walletService.getWalletByAffiliateId(this.userCookie.id).subscribe({
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

  loadBalanceInformation() {
    this.walletService
      .getBalanceInformationByAffiliateId(this.userCookie.id)
      .subscribe({
        next: (resp) => {
          this.balanceInformation.availableBalance = resp.availableBalance;
          this.balanceInformation.reverseBalance = resp.reverseBalance;
        },
        error: (err) => {
          this.showError('Error!');
        },
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
      pdf.text('Movimientos de mi billetera', pageWidth / 2, 20, { align: 'center' });

      const contentDataURL = canvas.toDataURL('image/png');
      pdf.addImage(contentDataURL, 'PNG', posX, posY, imgWidth, imgHeight);
      pdf.save('documento.pdf');
    });
  }

  copyTableData() {
    const rows = this.table._internalRows;
    if (rows && rows.length) {
      const headers = [
        this.translateService.instant('WALLET-PAGE.USER-COLUMN.TEXT'),
        this.translateService.instant('WALLET-PAGE.AFFILIATE-COLUMN.TEXT'),
        this.translateService.instant('WALLET-PAGE.CREDIT-COLUMN.TEXT'),
        this.translateService.instant('WALLET-PAGE.DEBIT-COLUMN.TEXT'),
        this.translateService.instant('WALLET-PAGE.STATE-COLUMN.TEXT'),
        this.translateService.instant('WALLET-PAGE.CONCEPT-COLUMN.TEXT'),
        this.translateService.instant('WALLET-PAGE.DATE-COLUMN.TEXT'),
        this.translateService.instant('WALLET-PAGE.DETAILS-COLUMN.TEXT'),
      ];

      const data = rows.map(row => [
        row.adminUserName,
        row.affiliateUserName,
        row.credit,
        row.debit,
        row.state ? 'Atendido' : 'No atendido',
        row.concept,
        row.date,
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
}
