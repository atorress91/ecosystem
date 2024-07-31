import { CreateChannelResponse } from './../../core/models/coinpay-model/create-channel-response.model';
import { CreatePagaditoTransactionRequest } from '@app/core/models/pagadito-model/create-pagadito-transaction-request.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/service/cart.service/cart.service';
import { Router } from '@angular/router';
import QRCode from 'qrcode';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { ProductsRequests, WalletRequest } from '@app/core/models/wallet-model/wallet-request.model';
import { CoinpaymentService } from '@app/core/service/coinpayment-service/coinpayment.service';
import { CreatePayment, ProductRequest } from '@app/core/models/coinpayment-model/create-payment.model';
import { WalletService } from "@app/core/service/wallet-service/wallet.service";
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { CreateTransactionResponse } from '@app/core/models/coinpay-model/create-transaction-response.model';
import { ConpaymentTransaction } from '@app/core/models/coinpayment-model/conpayment-transaction.model';
import { RequestPayment } from '@app/core/models/coinpay-model/request-payment.model';
import { CoinpayService } from '@app/core/service/coinpay-service/coinpay.service';
import { ConfigurationService } from '@app/core/service/configuration-service/configuration.service';
import { WalletWithdrawalsConfiguration } from '@app/core/models/wallet-withdrawals-configuration-model/wallet-withdrawals-configuration.model';
import { PaymentTransaction } from '@app/core/models/payment-transaction-model/payment-transaction-request.model';
import { PaymentTransactionService } from '@app/core/service/payment-transaction-service/payment-transaction.service';
import { WalletModel1BService } from '@app/core/service/wallet-model-1b-service/wallet-model-1b.service';
import { WalletModel1AService } from '@app/core/service/wallet-model-1a-service/wallet-model-1a.service';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { PagaditoService } from '@app/core/service/pagadito-service/pagadito.service';
import { PagaditoTransactionDetailRequest } from '@app/core/models/pagadito-model/pagadito-transaction-detail-request.model';
import { Subscription, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  today: Date;
  subTotal: number;
  total: number;
  totalTax: number = 0;
  totalDiscount: number = 0;
  products: any = [];
  user: UserAffiliate = new UserAffiliate();
  userReceivesPurchase: UserAffiliate = new UserAffiliate();
  walletRequest: WalletRequest = new WalletRequest();
  showReversePaymentOnly: boolean = false;
  transaction: ConpaymentTransaction = new ConpaymentTransaction();
  coinPayTransactionResponse = new CreateTransactionResponse();
  withdrawalConfiguration = new WalletWithdrawalsConfiguration();
  balancePaymentNotAvailable: boolean = false;
  reverseBalanceNotAvailable: boolean = false;
  excludedPaymentGroups = [2, 3, 7, 8, 9, 10];
  reverseBalanceExcludedPaymentGroups = [2, 7, 8];
  serviceBalanceExcludedPaymentGroups = [7, 8];
  serviceBalanceNotAvailable: boolean = false;
  model: string = ''
  pagaditoRequest = new CreatePagaditoTransactionRequest();
  referenceTransaction: string = '';
  private pollingSubscription: Subscription;
  private pollingInterval = 5000;

  constructor(
    private cartService: CartService,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private conpaymentService: CoinpaymentService,
    private walletService: WalletService,
    private coinpayService: CoinpayService,
    private configurationService: ConfigurationService,
    private paymentTransactionService: PaymentTransactionService,
    private walletModel1AService: WalletModel1AService,
    private walletModel1BService: WalletModel1BService,
    private affiliateService: AffiliateService,
    private pagaditoService: PagaditoService
  ) { }

  ngOnInit(): void {
    this.user = this.auth.currentUserAffiliateValue;

    this.today = new Date();
    this.today.getTime();
    this.cartService.getProducts()
      .subscribe(res => {
        this.products = res;
        this.setValuesToPaid();
      })

    this.verificateUrl();
    this.checkExistenceOfAffiliateForReversePayment();
    this.loadWithdrawalConfiguration();
  }

  ngOnDestroy() {
    this.cartService.clearPurchaseFromThirdParty();
    this.stopTransactionStatusPolling();
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  verificateUrl() {
    if (this.products.length === 0) {
      this.router.navigate(['app/home']);
    }
  }

  removeItem(item: any) {
    this.cartService.removeCartItem(item);
    this.setValuesToPaid();
    if (this.cartService.getProducts.length === 0) {
      this.verificateUrl();
    }
  }

  emptycart() {
    this.cartService.removeAllCart();
    this.verificateUrl();
  }

  setValuesToPaid(): void {
    let totalTax = 0;
    let subTotal = 0;
    let grandTotal = 0;

    if (this.products.length > 0) {
      const firstProduct = this.products[0];
      switch (firstProduct.paymentGroup) {
        case 2:
          this.model = '2';
          break;
        case 7:
          this.model = '1A';
          break;
        case 8:
          this.model = '1B';
          break;
        default:
          break;
      }
    }

    this.products.forEach(item => {
      if (!this.excludedPaymentGroups.includes(item.paymentGroup)) {
        this.balancePaymentNotAvailable = true;
      }

      if (this.reverseBalanceExcludedPaymentGroups.includes(item.paymentGroup)) {
        this.reverseBalanceNotAvailable = true;
      }

      this.serviceBalanceNotAvailable = !this.products.some(item =>
        this.serviceBalanceExcludedPaymentGroups.includes(item.paymentGroup));

      grandTotal += item.quantity * item.baseAmount;
      totalTax += parseFloat((item.tax).toFixed(0));
      subTotal += parseFloat(item.total.toFixed(2));
    });

    this.totalTax = totalTax;
    this.subTotal = subTotal;
    this.total = grandTotal;
  }

  showBalanceConfirmation(): Promise<boolean> {
    return Swal.fire({
      title: '¿Al realizar la compra estás aceptando los términos y condiciones, está seguro que desea realizar el pago?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quiero realizar el pago',
      cancelButtonText: 'No',
      html: `Por favor, asegúrese de haber leído y aceptado los <a href="https://ecosystemfx.com/wp-content/uploads/2024/01/ECOSYSTEM-V3.pdf" target="_blank">términos y condiciones</a>.`,
      preConfirm: () => {

      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.acceptTerms();
        return true;
      } else {
        return false;
      }
    }).catch(error => {
      console.error("Error en showBalanceConfirmation:", error);
      return false;
    });
  }

  showCoinPaymentConfirmation() {
    Swal.fire({
      title: '¿Está seguro que desea realizar el pago?',
      text: 'En caso de que no se confirme la totalidad de los fondos, su compra será revertida automáticamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {

      if (result.isConfirmed) {
        this.conpaymentService.createTransaction(this.createTransactionRequest()).subscribe((response: ConpaymentTransaction) => {
          this.transaction = response;

          if (response) {
            window.open(this.transaction.checkout_Url, '_blank');
            this.emptycart();
          }
        })
      }

    }).catch(error => {
      console.error("Error:", error);
    });
  }

  handleBalancePayment() {
    switch (this.model) {
      case '2':
        this.payWithMyBalanceModel2();
        break;
      case '1A':
        this.payWithMyBalanceModel1A();
        break;
      case '1B':
        this.payWithMyBalanceModel1B();
        break;
      default:
        break;
    }
  }

  handleServiceBalancePayment() {
    switch (this.model) {
      case '1A':
        this.payWithMyServiceBalanceModel1A();
        break;
      case '1B':
        this.payWithMyServiceBalanceModel1B();
        break;
      default:
        break;
    }
  }

  createBalanceRequest(): WalletRequest {
    this.walletRequest.affiliateId = this.user.id;
    this.walletRequest.affiliateUserName = this.user.user_name;
    this.walletRequest.paymentMethod = 1;

    this.products.forEach(item => {
      const productRequest = new ProductsRequests();
      productRequest.idProduct = item.id;
      productRequest.count = item.quantity;
      this.walletRequest.productsList.push(productRequest);
    });

    return this.walletRequest;
  }

  async payWithMyBalance() {
    const confirm = await this.showBalanceConfirmation();

    if (!confirm)
      return;

    this.walletService.payWithMyBalance(this.createBalanceRequest()).subscribe({
      next: (value) => {
        if (value.success == true) {
          this.showSuccess('Pago realizado correctamente');
          this.router.navigate(['app/home']);
          this.emptycart();
        } else {
          this.showError('Error: No se pudo realizar el pago.');
        }
      },
      error: (err) => {
        this.showError('Error: No se pudo realizar el pago.');
      },
    });
  }

  async payWithMyBalanceModel2() {
    const confirm = await this.showBalanceConfirmation();

    if (!confirm)
      return;

    this.walletService.payWithMyBalanceModel2(this.createBalanceRequest()).subscribe({
      next: (value) => {
        if (value.success == true) {
          this.showSuccess('Pago realizado correctamente');
          this.router.navigate(['app/home']);
          this.emptycart();
        } else {
          this.showError('Error: No se pudo realizar el pago.');
        }
      },
      error: (err) => {
        this.showError('Error: No se pudo realizar el pago.');
      },
    });
  }

  checkExistenceOfAffiliateForReversePayment(): Promise<boolean> {
    return new Promise((resolve) => {
      this.cartService.getPurchaseFromThirdParty().subscribe(user => {
        this.userReceivesPurchase = user;
        if (this.userReceivesPurchase && this.userReceivesPurchase.id) {
          this.showReversePaymentOnly = true;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  createTransactionRequest(): CreatePayment {
    const request = new CreatePayment();

    request.amount = this.total;
    request.buyer_email = this.user.email;
    request.buyer_name = this.user.name + ' ' + this.user.last_name;
    request.item_number = this.user.id.toString();
    request.ipn_url = 'https://wallet.ecosystemfx.net/api/v1/ConPayments/coinPaymentsIPN';
    request.currency1 = 'USDT.TRC20';
    request.currency2 = 'USDT.TRC20';
    request.item_name = this.user.user_name;

    request.products = this.products.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    return request;
  }

  async showCoinpayAlert(coinPayTransaction: CreateChannelResponse) {
    const qrCanvas = document.createElement('canvas');
    await QRCode.toCanvas(qrCanvas, coinPayTransaction.data.address);
    this.referenceTransaction = coinPayTransaction.data.idExternalIdentification.toString();

    Swal.fire({
      title: 'Realiza tu pago, escanea el código QR o ingresa la dirección de billetera',
      html: `
        <div>
          <div>Dirección Billetera: <strong> ${coinPayTransaction.data.address} </strong></div>
          <div>Id Transacción: <strong> ${coinPayTransaction.data.id} </strong> </div>
          <div>Monto: <strong> $${this.total} </strong> </div>
          <br>
        </div>
        <div id="loadingStatus" style="color: green;">Esperando confirmación...</div>
      `,
      imageUrl: qrCanvas.toDataURL(),
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: 'Código QR',
      showConfirmButton: false,
      allowOutsideClick: false
    });

    this.startTransactionStatusPolling(this.referenceTransaction);
  }


  createCoinPayTransaction() {
    let request = new RequestPayment();
    request.affiliateId = this.user.id;
    request.userName = this.user.user_name;
    request.amount = this.total;
    request.products = this.constructProductDetails();

    this.coinpayService.createChannel(request).subscribe({
      next: (response) => {

        if (response.success) {
          this.showCoinpayAlert(response.data);
        } else {
          this.showError("Error");
        }
      },
      error: (err) => {
        console.log(err);
        this.showError("Error");
      },
    });
  }

  constructProductDetails(): ProductRequest[] {
    return this.products.map(product => {
      return {
        productId: product.id,
        quantity: product.quantity
      };
    });
  }

  showCoinPayConfirmation() {
    Swal.fire({
      title: '¿Está seguro que desea realizar el pago?',
      text: 'En caso de que no se confirme la totalidad de los fondos, su compra será revertida automáticamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {

      if (result.isConfirmed) {
        this.createCoinPayTransaction();
      }

    }).catch(error => {
      console.error("Error:", error);
    });
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


  paymentByBankTransfer() {
    Swal.fire({
      title: 'Confirmación para pagos de transferencia',
      html:
        '<div class="container">' +
        '<div class="form-group">' +
        '<label for="reference">Número de referencia bancaria</label>' +
        '<input type="text" id="reference" class="form-control swal2-input" placeholder="Número de referencia bancaria">' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="date">Fecha del pago</label>' +
        '<input type="date" id="date" class="form-control swal2-input">' +
        '</div>' +
        '</div>',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const reference = (document.getElementById('reference') as HTMLInputElement).value;
        const dateInput = (document.getElementById('date') as HTMLInputElement).value;
        const date = new Date(dateInput);

        if (reference.trim() === '' || dateInput.trim() === '') {
          Swal.showValidationMessage('Por favor, complete todos los campos');
        } else {
          let transaction = new PaymentTransaction();
          transaction.affiliateId = this.user.id;
          transaction.amount = this.total;
          transaction.products = JSON.stringify(this.constructProductDetails());
          transaction.idTransaction = reference;
          transaction.createdAt = date;

          this.paymentTransactionService.createPaymentTransaction(transaction).subscribe({
            next: (value) => {
              this.showSuccess('Solicitud creada correctamente');
              this.router.navigate(['app/home']);
              this.emptycart();
            },
            error: (err) => {
              this.showError('Error');
            },
          })
        }
      }
    });
  }

  async payWithMyBalanceModel1A() {
    const confirm = await this.showBalanceConfirmation();

    if (!confirm)
      return;

    this.walletModel1AService.payWithMyBalance(this.createBalanceRequest()).subscribe({
      next: (value) => {
        if (value.success == true) {
          this.showSuccess('Pago realizado correctamente');
          this.router.navigate(['app/home']);
          this.emptycart();
        } else {
          this.showError('Error: No se pudo realizar el pago.');
        }
      },
      error: (err) => {
        this.showError('Error: No se pudo realizar el pago.');
      },
    });
  }

  async payWithMyBalanceModel1B() {
    const confirm = await this.showBalanceConfirmation();

    if (!confirm)
      return;

    this.walletModel1BService.payWithMyBalance(this.createBalanceRequest()).subscribe({
      next: (value) => {
        if (value.success == true) {
          this.showSuccess('Pago realizado correctamente');
          this.router.navigate(['app/home']);
          this.emptycart();
        } else {
          this.showError('Error: No se pudo realizar el pago.');
        }
      },
      error: (err) => {
        this.showError('Error: No se pudo realizar el pago.');
      },
    });
  }

  handleBuyMore() {
    switch (this.model) {
      case '2':
        this.router.navigate(['app/billing-purchase']);
        break;
      case '1A':
        this.router.navigate(['app/savings-plans']);
        break;
      case '1B':
        this.router.navigate(['app/savings-plans-one-b']);
        break;
      default:
        this.router.navigate(['app/educational-courses']);
        break;
    }
  }

  async payWithMyServiceBalanceModel1A() {
    const confirm = await this.showBalanceConfirmation();

    if (!confirm)
      return;

    this.walletModel1AService.payWithServiceBalance(this.createBalanceRequest()).subscribe({
      next: (value) => {
        if (value.success == true) {
          this.showSuccess('Pago realizado correctamente');
          this.router.navigate(['app/home']);
          this.emptycart();
        } else {
          this.showError('Error: No se pudo realizar el pago.');
        }
      },
      error: (error) => {
        this.showError('Error: No se pudo realizar el pago.');
      }
    })
  }

  async payWithMyServiceBalanceModel1B() {
    const confirm = await this.showBalanceConfirmation();

    if (!confirm)
      return;

    this.walletModel1BService.payWithMyServiceBalance(this.createBalanceRequest()).subscribe({
      next: (value) => {
        if (value.success == true) {
          this.showSuccess('Pago realizado correctamente');
          this.router.navigate(['app/home']);
          this.emptycart();
        } else {
          this.showError('Error: No se pudo realizar el pago.');
        }
      },
      error: (err) => {
        this.showError('Error: No se pudo realizar el pago.');
      },
    })
  }

  acceptTerms() {
    if (this.user.termsConditions != true) {
      this.affiliateService.updateAffiliate(this.user).subscribe({
        next: (value) => {
          this.showSuccess('Términos y condiciones actualizados correctamente');
          this.auth.setUserAffiliateValue(this.user);
        },
        error: (err) => {
          this.showError('Error');
        },
      })
    }
  }

  createPagaditoTransaction() {
    let totalExclusiveOfTax = (this.total * 1.10).toFixed(2);
    this.pagaditoRequest.amount = parseFloat(totalExclusiveOfTax);
    this.pagaditoRequest.affiliate_id = this.user.id;

    this.products.forEach(item => {

      let detail = new PagaditoTransactionDetailRequest();
      detail.quantity = item.quantity;
      detail.description = item.name;
      let individualPriceExclusiveOfTax = (item.salePrice * 1.10).toFixed(2);
      detail.price = parseFloat(individualPriceExclusiveOfTax);
      detail.url_product = item.id.toString();

      this.pagaditoRequest.details.push(detail);
    });

    Swal.fire({
      title: 'Confirmación de pago',
      text: 'Se aplicará una comisión por uso de tarjeta. Una vez realizado el pago, la transacción no será reembolsable. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, realizar pago'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pagaditoService.createTransaction(this.pagaditoRequest).subscribe({
          next: (response) => {
            if (response.success) {
              window.open(response.data);
              this.router.navigate(['app/home']);
              this.emptycart();
            }
          },
          error: (err) => {
            console.log(err)
          },
        });
      }
    });
  }

  startTransactionStatusPolling(reference: string) {
    this.pollingSubscription = timer(0, this.pollingInterval).pipe(
      switchMap(() => this.coinpayService.getTransactionByReference(reference))
    ).subscribe({
      next: (response) => {
        if (response.data == true) {

          Swal.update({
            title: "Pago confirmado",
            html: "Tu pago ha sido procesado exitosamente.",
            icon: "success",
            showConfirmButton: true
          });
          this.stopTransactionStatusPolling();
          this.router.navigate(['app/home']);
          this.emptycart();
        }
      },
      error: (error) => {
        console.error('Error al obtener el estado de la transacción:', error);
        Swal.update({
          title: "Error",
          html: "Hubo un problema al procesar tu pago.",
          icon: "error",
          showConfirmButton: true
        });
        this.stopTransactionStatusPolling();
      }
    });
  }


  stopTransactionStatusPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
