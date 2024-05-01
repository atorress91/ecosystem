import { AffiliateBtc } from '@app/core/models/affiliate-btc-model/affiliate-btc.model';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AffiliateBtcService } from '@app/core/service/affiliate-btc-service/affiliate-btc.service';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { ConfigureWalletService } from '@app/core/service/configure-wallet-service/configure-wallet.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configure-wallet',
  templateUrl: './configure-wallet.component.html'
})
export class ConfigureWalletComponent implements OnInit, AfterViewInit, OnDestroy {
  submitted: boolean = false;
  walletAddress: FormGroup;
  user: UserAffiliate = new UserAffiliate();
  affiliateBtc: AffiliateBtc = new AffiliateBtc();
  private subscriptionOpenedModal = new Subscription();
  @ViewChild('configureWalletModal') configureWalletModal: TemplateRef<any>;

  constructor(
    private configureWalletService: ConfigureWalletService,
    private authService: AuthService,
    private affiliateBtcService: AffiliateBtcService,
    private toastr: ToastrService,
    private affiliateService: AffiliateService
  ) { }

  ngOnInit(): void {
    this.initConfiguration();
    this.user = this.authService.currentUserAffiliateValue;

    this.subscriptionOpenedModal.add(
      this.configureWalletService.modalOpened$.subscribe(() => {
        this.loadConfiguration();
      })
    );
  }

  ngAfterViewInit() {
    this.configureWalletService.setModalContent(this.configureWalletModal);
  }

  ngOnDestroy(): void {
    this.subscriptionOpenedModal.unsubscribe();
  }

  get wallet_address_controls(): { [key: string]: AbstractControl } {
    return this.walletAddress.controls;
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  initConfiguration() {
    this.walletAddress = new FormGroup({
      trc_address: new FormControl('')
    })
  }

  loadConfiguration() {
    this.affiliateBtcService.getAffiliateBtcByAffiliateId(this.user.id).subscribe({
      next: (value) => {
        this.setConfiguration(value);
      },
      error: () => {
        this.showError('Error');
      },
    })
  }

  setConfiguration(value) {
    this.walletAddress.patchValue({
      trc_address: value.Address
    });
  }

  onSaveConfiguration() {
    this.submitted = true;
    if (this.walletAddress.invalid)
      return;

    this.affiliateBtc.affiliate_id = this.user.id;
    this.affiliateBtc.address = this.walletAddress.value.trc_address;
    this.affiliateBtc.Status = 1;

    this.affiliateBtcService.createAffiliateBtc(this.affiliateBtc).subscribe({
      next: (value) => {
        if (value.success) {
          this.showSuccess('Configuracion de la billetera creada correctamente.');
          this.configureWalletService.closeConfigureWalletModal();
        } else {
          this.showError('Billetera no valida.');
        }
      },
      error: (error) => {
        this.showError('Error');
      },
    })
  }

  showConfirmation() {
    this.generateVerificationCode();

    Swal.fire({
      title: 'Ingrese el código de verificación que ha sido enviado a su correo electrónico.',
      html: `
            <input id="swal-input-code" type="text" placeholder="Código de verificación" class="swal2-input">
            <input id="swal-input-password" type="password" placeholder="Contraseña" class="swal2-input">
        `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      didRender: () => {
        const codeElement = document.getElementById('swal-input-code') as HTMLInputElement;
        const passwordElement = document.getElementById('swal-input-password') as HTMLInputElement;

        if (codeElement) {
          codeElement.setAttribute('autocomplete', 'off');
          codeElement.value = '';
        }
        if (passwordElement) {
          passwordElement.setAttribute('autocomplete', 'off');
          passwordElement.value = '';
        }
      },
      preConfirm: () => {
        const codeElement = Swal.getPopup().querySelector('#swal-input-code') as HTMLInputElement;
        const passwordElement = Swal.getPopup().querySelector('#swal-input-password') as HTMLInputElement;

        if (!codeElement || !passwordElement) return;

        const code = codeElement.value.trim();
        const password = passwordElement.value.trim();

        if (!code && !password) {
          Swal.showValidationMessage('Por favor ingrese el código de verificación y la contraseña');
          return;
        }

        if (!code) {
          Swal.showValidationMessage('Por favor ingrese el código de verificación');
          return;
        }

        if (!password) {
          Swal.showValidationMessage('Por favor ingrese su contraseña');
          return;
        }

        this.affiliateBtc.password = password;
        this.affiliateBtc.verification_code = code;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSaveConfiguration();
      }
    });
  }



  generateVerificationCode() {
    this.affiliateService.generateVerificationCode(this.user.id, false).subscribe({
      next: (value) => {
        this.showSuccess('Se ha generado un código de seguridad, por favor revisa el correo electronico.');
      },
      error: () => {
        this.showError('Error');
      }
    })
  }
}
