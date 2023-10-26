import { Component, OnInit } from '@angular/core';

import { Product } from '@app/core/models/product-model/product.model';
import { CartService } from '@app/core/service/cart.service/cart.service';
import { ProductService } from '@app/core/service/product-service/product.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-funding-accounts',
  templateUrl: './funding-accounts.component.html',
  styleUrls: ['./funding-accounts.component.scss']
})
export class FundingAccountsComponent implements OnInit {
  products: Product[] = []

  constructor(private productService: ProductService, private cartService: CartService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getAllFundingAccounts();
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  getAllFundingAccounts() {
    this.productService.getAllFundingAccounts().subscribe({
      next: (value: Product[]) => {
        this.products = value;
        this.products.forEach((item: any) => {
          Object.assign(item, { quantity: 1, total: item.salePrice });
        });
      },
      error: (err) => {
        this.showError('Error');
      },
    })
  }

  addtocart(item: any) {
    this.cartService.addtoCart(item);
  }
}
