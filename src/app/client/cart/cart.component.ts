
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/service/cart.service/cart.service';
import { Router } from '@angular/router';
import QRCode from 'qrcode';

import { ProductsRequests, WalletRequest } from '@app/core/models/wallet-model/wallet-request.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { environment } from '@environments/environment';
import { CoinpaymentService } from '@app/core/service/coinpayment-service/coinpayment.service';
import { CreatePayment, ProductRequest } from '@app/core/models/coinpayment-model/create-payment.model';
import { WalletService } from "@app/core/service/wallet-service/wallet.service";
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { CreateTransactionResponse } from '@app/core/models/coinpay-model/create-transaction-response.model';
import { ConpaymentTransaction } from '@app/core/models/coinpayment-model/conpayment-transaction.model';
import { RequestPayment } from '@app/core/models/coinpay-model/request-payment.model';
import { CoinpayService } from '@app/core/service/coinpay-service/coinpay.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  today: Date;
  subTotal: number;
  total: number;
  totalTax: number;
  totalDiscount: number;
  public products: any = [];
  public user: UserAffiliate = new UserAffiliate();
  public userReceivesPurchase: UserAffiliate = new UserAffiliate();
  public walletRequest: WalletRequest = new WalletRequest();
  public showReversePaymentOnly: boolean = false;
  transaction: ConpaymentTransaction = new ConpaymentTransaction();
  coinPayTransactionResponse = new CreateTransactionResponse();

  constructor(
    private cartService: CartService,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private conpaymentService: CoinpaymentService,
    private walletService: WalletService,
    private coinpayService: CoinpayService
  ) { }

  ngOnInit(): void {
    this.user = this.auth.currentUserAffiliateValue;

    this.today = new Date();
    this.today.getTime();
    this.cartService.getProducts()
      .subscribe(res => {
        this.products = res;
      })
    this.setValuesToPaid();
    this.verificateUrl();
    this.checkExistenceOfAffiliateForReversePayment();
  }

  ngOnDestroy() {
    this.cartService.clearPurchaseFromThirdParty();
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  verificateUrl() {
    if (this.products.length === 0) {
      this.router.navigate(['app/billing-purchase']);
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

    this.products.forEach(item => {
      console.log(item);
      grandTotal += item.quantity * item.baseAmount
      totalTax += parseFloat((item.tax).toFixed(0));
      subTotal += parseFloat(item.total.toFixed(0));
    });

    this.totalTax = totalTax;
    this.subTotal = subTotal;
    this.total = grandTotal;
  }

  showConfirmation(option: number) {
    Swal.fire({
      title: '¿Está seguro que desea realizar el pago?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.payWithBalance(option);
      }
    }).catch(error => {
      console.error("Error:", error);
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

  payWithBalance(option: number) {
    if (option === 1) {

      this.checkExistenceOfAffiliateForReversePayment().then(userExists => {
        if (userExists) {

          option = 2;
        }
        this.processPayment(option);
      });
    } else {
      this.processPayment(option);
    }
  }

  private processPayment(option: number) {
    this.walletRequest.affiliateId = this.user.id;
    this.walletRequest.affiliateUserName = this.user.user_name;
    this.walletRequest.paymentMethod = option;

    if (option === 2 && this.userReceivesPurchase) {
      this.walletRequest.purchaseFor = this.userReceivesPurchase.id;
    } else {
      this.walletRequest.purchaseFor = 0;
    }

    this.products.forEach(item => {
      const productRequest = new ProductsRequests();
      productRequest.idProduct = item.id;
      productRequest.count = item.quantity;
      this.walletRequest.productsList.push(productRequest);
    });

    this.walletService.payWithMyBalance(this.walletRequest).subscribe({
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

  async showAlert(coinPayResponse: CreateTransactionResponse) {

    const qrCanvas = document.createElement('canvas');
    await QRCode.toCanvas(qrCanvas, coinPayResponse.data.qrCode);

    Swal.fire({
      title: 'Realiza tu pago, escanea el código QR',
      html: `
        <div>
          <div>Id Transacción: ${coinPayResponse.data.idTransaction}</div>
          <div>Monto: $${coinPayResponse.data.amount}</div>
          <br>
        </div>
      `,
      imageUrl: qrCanvas.toDataURL(),
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: 'Código QR',
    });
  }

  createCoinPayTransaction() {
    let request = new RequestPayment();
    request.affiliateId = this.user.id;
    request.amount = this.total;
    request.products = this.constructDetails();

    this.coinpayService.createCoinPayTransaction(request).subscribe({
      next: (response: CreateTransactionResponse) => {
        console.log(response);
        this.coinPayTransactionResponse = response;

        if (response.statusCode === 1) {
          this.showAlert(response);
        } else {
          this.showError(response.message || "Error");
        }
      },
      error: (err) => {
        this.showError("Error");
      },
    });
  }

  constructDetails(): ProductRequest[] {
    return this.products.map(product => {
      return {
        productId: product.id,
        quantity: product.quantity
      };
    });
  }

  constructCoinPayRequest(): RequestPayment {
    let request = new RequestPayment();
    request.affiliateId = this.user.id;
    request.amount = this.total;
    request.products = this.constructDetails();
    return request;
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
}
