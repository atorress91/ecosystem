import { TranslateService } from '@ngx-translate/core';
import { CartService } from 'src/app/core/service/cart.service/cart.service';
import Swal from 'sweetalert2';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { NetworkAffiliate } from '@app/core/models/network-affiliate/network.affiliate.model';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { Grading } from '@app/core/models/grading-model/grading.model';
import { GradingService } from '@app/core/service/grading-service/grading.service';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { WalletService } from '@app/core/service/wallet-service/wallet.service';
import { ToastrService } from 'ngx-toastr';
import { TransferBalance } from '@app/core/models/wallet-model/transfer-balance.model';
import { EncryptService } from '@app/core/service/encrypt-service/encrypt.service';
import { ConfigurationService } from '@app/core/service/configuration-service/configuration.service';
import { WalletWithdrawalsConfiguration } from '@app/core/models/wallet-withdrawals-configuration-model/wallet-withdrawals-configuration.model';
import { TruncateDecimalsPipe } from "@app/shared/truncate-decimals.pipe";
import { PagaditoTransactionDetailRequest } from '@app/core/models/pagadito-model/pagadito-transaction-detail-request.model';
import { CreatePagaditoTransactionRequest } from '@app/core/models/pagadito-model/create-pagadito-transaction-request.model';
import { PagaditoService } from '@app/core/service/pagadito-service/pagadito.service';
import { Product } from '@app/core/models/product-model/product.model';
import { ProductService } from '@app/core/service/product-service/product.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html'
})
export class NetworkComponent implements OnInit {
  isCollapsed = true;
  private user: UserAffiliate = new UserAffiliate();
  private destroy$ = new Subject();
  rows: NetworkAffiliate[] = [];
  gradings: Grading[] = [];
  transferBalance: TransferBalance = new TransferBalance();
  temp = [];
  userBalance: number;
  loadingIndicator = true;
  loadingIndicatorGlobal = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  rowsGlobal = [];
  tempGlobal = [];
  userName: string;
  withdrawalConfiguration = new WalletWithdrawalsConfiguration();
  isNewUser: boolean = false;
  pagaditoRequest = new CreatePagaditoTransactionRequest();
  currentMembership: Product = new Product();

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private affiliateService: AffiliateService,
    private authService: AuthService,
    private gradingService: GradingService,
    private walletService: WalletService,
    private toastr: ToastrService,
    private encryptService: EncryptService,
    private route: Router,
    private cartService: CartService,
    private translateService: TranslateService,
    private configurationService: ConfigurationService,
    private truncatedDecimals: TruncateDecimalsPipe,
    private pagaditoService: PagaditoService,
    private productService: ProductService,
  ) {
  }

  ngOnInit() {
    this.loadingIndicatorGlobal = false;
    this.loadAllMemberships()
    this.authService.currentUserAffiliate.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user.id) {
        this.user = user;
        this.affiliateService.changeId(this.user.id);
        this.gradingService.getAll().pipe(takeUntil(this.destroy$)).subscribe((gradings: Grading[]) => {
          this.gradings = gradings;
        });

        this.affiliateService.GetPersonalNetwork(user.id).pipe(takeUntil(this.destroy$)).subscribe((affiliates: NetworkAffiliate[]) => {
          this.temp = [...affiliates];
          this.rows = affiliates;
        });
      }
      this.loadingIndicator = false;
    });

    this.loadBalanceAvailable();
    this.loadWithdrawalConfiguration();
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  getNameGrading(id) {
    let grading = this.gradings.find(item => item.id === id);
    return grading !== undefined ? grading.name : 'N/A';
  }

  loadBalanceAvailable() {
    this.walletService.getBalanceInformationByAffiliateId(this.user.id).subscribe({
      next: (value) => {
        this.userBalance = value.availableBalance;
      },
      error: () => {
        this.showError("Error");
      },
    })
  }

  loadAllMemberships() {
    this.productService.getAllMembership().subscribe({
      next: (resp) => {
        this.currentMembership = resp[0];
      },
      error: (err) => { },
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = event.target.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

  getRowHeight(row) {
    return row.height;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    this.rows = this.temp.filter(function (d) {
      return d.userName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.table.offset = 0;
  }

  TransferBalanceForMembership(user) {
    this.transferBalance.fromAffiliateId = this.user.id;
    this.transferBalance.fromUserName = this.user.user_name;
    this.transferBalance.toUserName = user.userName || user.user_name;

    this.walletService.transferBalanceForMembership(this.transferBalance).subscribe({
      next: (value) => {
        if (value) {
          this.showSuccess("Transferencia realizada correctamente");
        } else {
          this.showError("Error, verifique que tenga saldo.");
        }
      },
      error: () => {
        this.showError("Error");
      },
    });
  }

  showConfirmationTransferBalanceForMembership(row) {
    this.generateVerificationCode();
    Swal.fire({
      title: 'Ingrese el código de verificación que ha sido enviado a su correo electrónico.',
      html: `<input id = "swal-input-code" type="text" placeholder="Código de verificación" class="swal2-input">`,
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const codeElement = Swal.getPopup().querySelector('#swal-input-code') as HTMLInputElement;
        if (!codeElement) return;

        const code = codeElement.value.trim();
        if (!code) {
          Swal.showValidationMessage('Por favor ingrese el código de verificación');
        }

        this.transferBalance.securityCode = code;

        return code;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.TransferBalanceForMembership(row);
      }
    });
  }

  showConfirmationTransferBalance(row) {
    this.generateVerificationCode();

    let formattedBalance = this.truncatedDecimals.transform(this.userBalance, 2);

    Swal.fire({
      title: 'Ingrese el código de verificación que ha sido enviado a su correo electrónico.',
      html: `
    <span style="font-size: 18px;">Transferencia para <span style="color: #ff5733;">${row.userName || row.user_name}</span></span><br>
    <span style="font-size: 18px;">Saldo Disponible <span style="color: #ff5733;">${formattedBalance}</span></span>
      <input id="swal-input-amount" type="number" placeholder="Monto" min="0" step="0.01" class="swal2-input">
      <input id="swal-input-code" type="text" placeholder="Código de verificación" class="swal2-input">
    `,
      showCancelButton: true,
      confirmButtonText: 'Transferir',
      cancelButtonText: 'Cancelar',
      preConfirm: this.swalPreConfirm.bind(this)
    })
      .then(result => {
        if (result.isConfirmed) {
          this.handleAmountEntry(result.value, row);
        }
      })
      .catch(error => console.error("Error:", error));
  }

  swalPreConfirm() {
    const amountElement = Swal.getPopup().querySelector('#swal-input-amount') as HTMLInputElement;
    const codeElement = Swal.getPopup().querySelector('#swal-input-code') as HTMLInputElement;

    if (!amountElement || !codeElement) return;

    const amount = parseFloat(amountElement.value);
    const code = codeElement.value;
    this.transferBalance.securityCode = code;

    if (isNaN(amount) || amount <= 0) {
      Swal.showValidationMessage('Por favor ingrese un monto válido');
    }
    if (!code.trim()) {
      Swal.showValidationMessage('Por favor ingrese el código de verificación');
    }
    if (amount > this.userBalance) {
      Swal.showValidationMessage('El monto no puede ser mayor al saldo disponible');
    }

    return amount;
  }

  handleAmountEntry(result, user) {
    if (result && result > 0) {
      const amount = Number(result);
      if (amount > this.userBalance) {
        this.showError('El monto ingresado supera el saldo disponible.');
      } else {
        this.showTransferConfirmation(amount, user);
      }
    } else if (!result.dismiss) {
      this.showError('Por favor ingrese un monto válido (mayor a 0).');
    }
  }

  showTransferConfirmation(amount, row) {
    Swal.fire({
      title: '¿Está seguro que desea transferir saldo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.transferBalance.amount = amount;
        this.TransferBalance(row);
      }
    }).catch(error => {
      console.error("Error:", error);
    });
  }

  TransferBalance(user) {
    this.transferBalance.fromAffiliateId = this.user.id;
    this.transferBalance.fromUserName = this.user.user_name;
    this.transferBalance.toUserName = user.userName;
    if (user.userName == undefined) {
      this.transferBalance.toUserName = user.user_name;
    }
    const result = this.encryptService.encryptObject(this.transferBalance);
    this.walletService.transferBalance(result).subscribe({
      next: (value) => {
        if (value.success) {
          this.showSuccess(value.message);
        } else {
          this.showError(value.message);
        }
      },
      error: (error) => {
        this.showError("Error");
      },
    })
  }

  setUserAffiliateByUserName(event) {
    this.userName = event.target.value;
  }

  getUserAffiliateByUserName() {
    this.rowsGlobal = [];
    this.affiliateService.getAffiliateByUserName(this.userName).subscribe({
      next: (value) => {
        if (value) {
          if (value.activation_date == null) {
            this.isNewUser = true;
          } else {
            this.isNewUser = false;
          }
          this.rowsGlobal = [value];
          this.tempGlobal = value;
          this.loadingIndicatorGlobal = false;
        } else {
          this.rowsGlobal = [];
          this.showError('Usuario no existe');
        }
      },
      error: () => {
        this.showError('Error');
      }
    })
  }

  redirectToPurchases(row) {
    this.cartService.setPurchaseFromThirdParty(row);
    this.route.navigate(['app/billing-purchase']);
  }

  redirectToUnilevelTree() {

    this.route.navigate(['app/trees'])
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
      pdf.text('Mi red', pageWidth / 2, 20, { align: 'center' });

      const contentDataURL = canvas.toDataURL('image/png');
      pdf.addImage(contentDataURL, 'PNG', posX, posY, imgWidth, imgHeight);
      pdf.save('documento.pdf');
    });
  }


  copyTableData() {
    const rows = this.table._internalRows;
    if (rows?.length ?? 0) {
      const headers = [
        this.translateService.instant('NETWORK-PAGE.ROW-USER.TEXT'),
        this.translateService.instant('NETWORK-PAGE.ROW-STATE.TEXT'),
        this.translateService.instant('NETWORK-PAGE.ROW-QUALIFICATION.TEXT'),
        this.translateService.instant('NETWORK-PAGE.ROW-EMAIL.TEXT'),
        this.translateService.instant('NETWORK-PAGE.ROW-DETAIL.TEXT')
      ];

      const data = rows.map(row => [
        row.userName,
        row.status ? 'Activa' : 'Cancelada',
        row.calification,
        row.email,
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

  generateVerificationCode() {
    this.affiliateService.generateVerificationCode(this.user.id, false).subscribe({
      next: (value) => {
        const toastConfig = {
          positionClass: 'toast-top-center'
        };

        this.toastr.success('Se ha generado un código de seguridad, por favor revisa el correo electronico.', null, toastConfig);
      },
      error: () => {
        this.showError('Error');
      }
    })
  }

  createPagaditoTransaction(row: UserAffiliate) {
    this.pagaditoRequest.amount = this.currentMembership.salePrice * 1.10;
    this.pagaditoRequest.affiliate_id = row.id;

    let detail = new PagaditoTransactionDetailRequest();
    detail.quantity = 1;
    detail.description = this.currentMembership.description;

    detail.price = this.currentMembership.salePrice * 1.10;
    detail.url_product = this.currentMembership.id.toString();

    this.pagaditoRequest.details.push(detail);

    Swal.fire({
      title: 'Confirmación de pago',
      text: 'Se aplicará una comisión por uso de tarjeta. Una vez realizado el pago la transacción no será reembolsable. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, realizar pago'
    }).then((result) => {
      if (result.isConfirmed) {
        this.executePagaditoTransaction();
      }
    });
  }

  executePagaditoTransaction() {
    this.pagaditoService.createTransaction(this.pagaditoRequest).subscribe({
      next: (response) => {
        if (response.success) {
          window.open(response.data);
          this.showPostPaymentModal();
        }
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al procesar el pago. Por favor, intente nuevamente.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Cerrar'
        });
      },
    });
  }

  showPostPaymentModal() {
    Swal.fire({
      title: 'Pago en Proceso',
      text: 'Una vez realizado el pago, el sistema activará automáticamente al usuario.',
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Entendido'
    });
  }
}
