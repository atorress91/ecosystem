export interface ProductRequest {
  productId: number;
  quantity: number;
}

export class RequestPayment {
  affiliateId: number;
  amount: number;
  products: ProductRequest[];

  constructor() {
    this.affiliateId = 0;
    this.amount = 0;
    this.products = [];
  }
}
