import { Page404Component } from './../../../authentication/page404/page404.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '@app/core/models/product-model/product.model';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { ProductsRequests, WalletRequest } from '@app/core/models/wallet-model/wallet-request.model';
import { ProductService } from '@app/core/service/product-service/product.service';
import { WalletService } from '@app/core/service/wallet-service/wallet.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-make-purchase-modal',
  templateUrl: './make-purchase-modal.component.html',
  styleUrls: ['./make-purchase-modal.component.sass']
})
export class MakePurchaseModalComponent implements OnInit {
  makePurchaseForm: FormGroup;
  @ViewChild('makePurchaseModal') makePurchaseModal: NgbModal;
  public walletRequest: WalletRequest = new WalletRequest();
  public products: any = [];
  user: UserAffiliate = new UserAffiliate();
  public productList: any;
  public filterCategory: any;

  constructor(private modalService: NgbModal,
    private walletService: WalletService,
    private toastr: ToastrService,
    private productService: ProductService) {
  }

  ngOnInit(): void {
    this.loadAllEcoPooles();
    this.initMakePurchaseForm();
  }

  initMakePurchaseForm() {
    this.makePurchaseForm = new FormGroup({
      selectedProduct: new FormControl('', Validators.required),
      quantity: new FormControl(1, Validators.required)
    });
  }

  openMakePurchaseModal(content, user) {
    this.user = user;

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
  }

  processPayment(option: number) {
    this.walletRequest.productsList = [];
    this.walletRequest.affiliateId = this.user.id;
    this.walletRequest.affiliateUserName = this.user.user_name;
    this.walletRequest.paymentMethod = option;
    this.walletRequest.purchaseFor = 0;

    this.products.forEach(item => {
      const productRequest = new ProductsRequests();
      productRequest.idProduct = item.id;
      productRequest.count = item.quantity;
      this.walletRequest.productsList.push(productRequest);
    });

    this.walletService.payWithMyBalanceAdmin(this.walletRequest).subscribe({
      next: (value) => {
        if (value.success == true) {
          this.showSuccess('Pago realizado correctamente');
          this.walletRequest.productsList = [];
          this.products = [];
          this.modalService.dismissAll();
        } else {
          this.showError('Error: No se pudo realizar el pago.');
        }
      },
      error: (err) => {
        this.showError('Error: No se pudo realizar el pago.');
      },
    });
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  loadAllEcoPooles() {
    this.productService.getAllEcoPooles().subscribe((ecopools: Product) => {
      this.productList = ecopools;
      this.filterCategory = ecopools;
      this.productList.forEach((item: any) => {
        Object.assign(item, { quantity: 1, total: item.salePrice });
      });
    });
  }

  addProductToList() {
    const selectedProduct = this.productList.find(p => p.id == this.makePurchaseForm.get('selectedProduct').value);
    const quantity = this.makePurchaseForm.get('quantity').value;

    const existingProduct = this.products.find(p => p.id == selectedProduct.id);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      this.products.push({
        ...selectedProduct,
        quantity: quantity
      });
    }

    this.makePurchaseForm.reset();
  }

  removeProductFromList(product) {
    const index = this.products.findIndex(p => p.id == product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  confirmPurchase(option: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres realizar la compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, comprar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.processPayment(option);
      }
    });
  }
}
