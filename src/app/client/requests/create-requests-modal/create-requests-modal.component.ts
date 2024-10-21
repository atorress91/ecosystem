import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

import { WalletRequestService } from '@app/core/service/wallet-request/wallet-request.service';
import { ToastrService } from 'ngx-toastr';
import { WalletRequestRequest } from '@app/core/models/wallet-request-request-model/wallet-request-request.model';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { BalanceInformation } from '@app/core/models/wallet-model/balance-information.model';
import { WalletWithdrawalsConfiguration } from '@app/core/models/wallet-withdrawals-configuration-model/wallet-withdrawals-configuration.model';
import { AffiliateBtcService } from '@app/core/service/affiliate-btc-service/affiliate-btc.service';
import { AffiliateBtc } from '@app/core/models/affiliate-btc-model/affiliate-btc.model';

@Component({
  selector: 'app-create-requests-modal',
  templateUrl: './create-requests-modal.component.html',
})
export class CreateRequestsModalComponent implements OnInit {
  walletRequest: WalletRequestRequest = new WalletRequestRequest();
  affiliateBtc: AffiliateBtc = new AffiliateBtc();
  sendRequest: FormGroup;
  submitted = false;
  today: string;

  withdrawalDates = [];
  @Input() user: UserAffiliate;
  @Input() balanceInfo: BalanceInformation;
  @Input() walletWithdrawalConfig: WalletWithdrawalsConfiguration;
  @ViewChild('createRequestModal') createRequestModal: NgbModal;
  @Output('loadWalletRequest') loadWalletRequest: EventEmitter<any> = new EventEmitter();
  @Output('setAvailableBalance') setAvailableBalance: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private walletRequestService: WalletRequestService,
    private toastr: ToastrService,
    private affiliateService: AffiliateService,
    private affiliateBtcService: AffiliateBtcService
  ) { }

  ngOnInit(): void {
    this.getUtcToday();
    this.loadValidations();
    this.hasCoinPaymentAddress();
  }

  get request_controls(): { [key: string]: AbstractControl } {
    return this.sendRequest.controls;
  }

  private getUtcToday() {
    const now = DateTime.local();
    this.today = now.toISODate();
  }

  showError(message) {
    this.toastr.error(message);
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  openCreateRequestModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
  }

  private loadValidations() {
    this.sendRequest = new FormGroup({
      amount_requested: new FormControl('', Validators.required),
      access_key: new FormControl('', Validators.required),
      observation: new FormControl('', Validators.required),
      generation_code: new FormControl('', Validators.required)
    });
  }

  onSaveRequest() {
    if (!this.affiliateBtc || this.affiliateBtc.trc20Address == null) {
      this.showError('Tiene que tener configurada su dirección de billetera para poder realizar la solicitud.');
      return;
    }

    this.submitted = true;
    if (this.sendRequest.invalid) {
      return;
    }

    this.setWalletRequest();

    if (!this.isValidAmount(this.walletRequest.amount)) {
      this.showError('El monto debe estar en el rango del mínimo y máximo.');
      return;
    }

    this.walletRequestService.createWalletRequest(this.walletRequest).subscribe({
      next: (resp) => {
        if (resp.success == true) {
          this.showSuccess('Su solicitud de retiro se ha creado correctamente');
          this.sendRequest.reset();
          this.modalService.dismissAll();
          this.loadWalletRequest.emit();
          this.setAvailableBalance.emit();
        } else if (resp.success == false) {
          this.showError('Las credenciales no coinciden');
          this.sendRequest.reset();
        }
      },
      error: (err) => {
        this.showError('Ha ocurrido un error al procesar su solicitud.');
      },
    })
  }

  private setWalletRequest(): void {
    this.walletRequest.affiliateId = this.user.id;
    this.walletRequest.affiliateName = `${this.user.name} ${this.user.last_name} (${this.user.user_name})`;
    this.walletRequest.userPassword = this.sendRequest.value.access_key;
    this.walletRequest.verificationCode = this.sendRequest.value.generation_code;
    this.walletRequest.amount = Number(this.sendRequest.value.amount_requested);
    this.walletRequest.concept = this.sendRequest.value.observation;
  }

  private isValidAmount(amount: number): boolean {
    if (amount <= 0) {

      return false;
    } else if (this.walletWithdrawalConfig.maximum_amount == 0) {

      return amount <= this.checkMinimumAmount() &&
        amount >= this.walletWithdrawalConfig.minimum_amount;
    } else {

      return amount <= this.checkMinimumAmount() &&
        amount >= this.walletWithdrawalConfig.minimum_amount &&
        amount <= this.walletWithdrawalConfig.maximum_amount;
    }
  }

  private checkMinimumAmount(): number {
    let amount = this.balanceInfo.availableBalance;
    return amount;
  }

  onGenerateVerificationCode() {
    this.affiliateService.generateVerificationCode(this.user.id, true).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.showSuccess('Se ha generado correctamente el código de verificación. Por favor, revise su correo electrónico para obtener el código de verificación.');
        } else {
          this.messageNotIsWithdrawalDate();
        }
      },
      error: (err) => {
        this.showError("Error");
      },
    });
  }

  messageNotIsWithdrawalDate() {
    Swal.fire({
      icon: 'warning',
      title: '¡Saludos!',
      text: 'Las comisiones voluntarias estarán disponibles para ser retiradas en su billetera según el calendario de la empresa.',
      confirmButtonText: 'Entendido'
    });
  }

  hasCoinPaymentAddress() {
    this.affiliateBtcService.getAffiliateBtcByAffiliateId(this.user.id).subscribe({
      next: (value) => {
        this.affiliateBtc = value;
      },
      error: () => {
        this.showError('Error');
      },
    })
  }
}
