export class InvoiceModelOneTwo {
  userName: string;
  invoiceId: number;
  productName: string;
  productPrice: number;
  paymentGroupId: number;
  createdAt: Date;

  constructor() {
    this.userName = '';
    this.invoiceId = 0;
    this.productName = '';
    this.productPrice = 0;
    this.paymentGroupId = 0;
    this.createdAt = new Date();
  }
}
