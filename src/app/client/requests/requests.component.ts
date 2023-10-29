import { BalanceInformation } from '@app/core/models/wallet-model/balance-information.model';
import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { WalletRequestService } from '@app/core/service/wallet-request/wallet-request.service';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { ToastrService } from 'ngx-toastr';
import { WalletService } from '@app/core/service/wallet-service/wallet.service';
import { ConfigurationService } from '@app/core/service/configuration-service/configuration.service';
import { WalletWithdrawalsConfiguration } from '@app/core/models/wallet-withdrawals-configuration-model/wallet-withdrawals-configuration.model';


@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
})
export class RequestsComponent implements OnInit {
  user: UserAffiliate = new UserAffiliate();
  balanceInfo: BalanceInformation = new BalanceInformation();
  walletWithdrawalsConfig: WalletWithdrawalsConfiguration = new WalletWithdrawalsConfiguration();
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private walletRequestService: WalletRequestService,
    private authService: AuthService,
    private toastr: ToastrService,
    private configurationService: ConfigurationService,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
    this.loadWalletRequest();
    this.loadWalletWithdrawalConfiguration();
    this.setAvailableBalance();
  }

  loadWalletRequest() {
    this.walletRequestService
      .getWalletRequestByAffiliateId(this.user.id)
      .subscribe({
        next: (resp) => {
          if (resp != null) {
            this.temp = [...resp];
            this.rows = resp;
          }
          this.loadingIndicator = false;
        },
        error: (err) => {
          this.showError('Error');
        },
      });
  }

  setAvailableBalance() {
    this.walletService.getBalanceInformationByAffiliateId(this.user.id).subscribe(balanceInfo => {
      this.balanceInfo = balanceInfo;
    });

  }

  private loadWalletWithdrawalConfiguration() {
    this.configurationService.getWithdrawalsWalletConfiguration().subscribe({
      next: (resp) => {
        this.walletWithdrawalsConfig.minimum_amount = resp.minimum_amount;
        this.walletWithdrawalsConfig.maximum_amount = resp.maximum_amount;
      },
      error: (err) => {
        this.showError('Error');
      },
    })

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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.observation.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  getUserInfo() {
    this.authService.currentUserAffiliate.subscribe({
      next: (value) => {
        this.user = value;
      }
    });
  }

  showError(message) {
    this.toastr.error(message);
  }
}
