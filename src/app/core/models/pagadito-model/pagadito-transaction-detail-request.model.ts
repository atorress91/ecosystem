export class PagaditoTransactionDetailRequest {
  quantity: string;
  description: string;
  price: string;
  url_product: string;

  constructor() {
    this.quantity = '';
    this.description = '';
    this.price = '';
    this.url_product = '';
  }
}
