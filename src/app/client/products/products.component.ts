import { Component, Input, OnInit } from '@angular/core';

import { Product } from '@app/core/models/product-model/product.model';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/core/service/cart.service/cart.service';
import { ProductService } from 'src/app/core/service/product-service/product.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  public productList: any;
  public filterCategory: any;
  @Input() tabActive: number;
  searchKey: string = '';

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private toatr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cartService.search.subscribe((val: any) => {
      this.searchKey = val;
    });
    this.handleProductLoading(this.tabActive);
  }

  addtocart(item: any) {
    this.cartService.addtoCart(item);
  }

  filter(category: string) {
    this.filterCategory = this.productList.filter((a: any) => {
      if (a.category == category || category == '') {
        return a;
      }
    });
  }

  showError(error) {
    this.toatr.error(error);
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

  loadAllServices() {
    this.productService.getAllServices().subscribe((services: Product) => {
      this.productList = services;
      this.filterCategory = services;
      this.productList.forEach((item: any) => {
        Object.assign(item, { quantity: 1, total: item.salePrice });
      });
    })
  }

  handleProductLoading(tabActive: number) {
    switch (tabActive) {
      case 1:
        this.loadAllEcoPooles();
        break;
      case 2:
        this.loadAllServices();
        break;
      default:
        this.showError('No se encontró productos');
        break;
    }
  }

}
